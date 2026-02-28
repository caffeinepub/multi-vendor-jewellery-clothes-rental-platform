import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Bool "mo:core/Bool";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Application-level roles
  public type UserRole = {
    #admin;
    #customer;
    #vendor;
    #center;
  };

  public type ProductStatus = {
    #atVendor;
    #atCenter;
    #onTrial;
    #rented;
    #underSanitization;
  };

  public type RentalStatus = {
    #trialBooked;
    #trialCompleted;
    #paymentDone;
    #sanitizing;
    #readyForHandover;
    #rented;
    #returned;
    #closed;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    role : UserRole;
    kyc_status : Bool;
    kyc_doc : ?Storage.ExternalBlob;
    gst_number : ?Text;
    bank_kyc : ?Text;
  };

  public type User = {
    id : Nat;
    principal : Principal;
    role : UserRole;
    name : Text;
    email : Text;
    phone : Text;
    kyc_status : Bool;
    kyc_doc : ?Storage.ExternalBlob;
    gst_number : ?Text;
    bank_kyc : ?Text;
  };

  public type Product = {
    id : Nat;
    vendor_id : Nat;
    center_id : Nat;
    name : Text;
    description : Text;
    rental_price : Nat;
    deposit_amount : Nat;
    availability_status : ProductStatus;
    sanitization_status : Bool;
    images : [Storage.ExternalBlob];
    approved : Bool;
  };

  public type AuditLog = {
    id : Nat;
    action : Text;
    user_id : Nat;
    timestamp : Int;
    details : Text;
  };

  public type ProductQuery = {
    center_id : ?Nat;
    status : ?ProductStatus;
    min_rental_price : ?Nat;
    max_rental_price : ?Nat;
    vendor_id : ?Nat;
    only_sanitized : Bool;
    only_approved : Bool;
  };

  // Stores
  let userStore = Map.empty<Nat, User>();
  let principalToUserId = Map.empty<Principal, Nat>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let productStore = Map.empty<Nat, Product>();
  let auditLogStore = Map.empty<Nat, AuditLog>();

  var nextUserId = 1;
  var nextProductId = 1;
  var nextAuditLogId = 1;

  func getAppRole(caller : Principal) : ?UserRole {
    switch (principalToUserId.get(caller)) {
      case null { null };
      case (?uid) {
        switch (userStore.get(uid)) {
          case null { null };
          case (?u) { ?u.role };
        };
      };
    };
  };

  func isAppAdmin(caller : Principal) : Bool {
    switch (getAppRole(caller)) {
      case (?(#admin)) { true };
      case (_) { false };
    };
  };

  func isAppVendor(caller : Principal) : Bool {
    switch (getAppRole(caller)) {
      case (?(#vendor)) { true };
      case (_) { false };
    };
  };

  func isAppCenter(caller : Principal) : Bool {
    switch (getAppRole(caller)) {
      case (?(#center)) { true };
      case (_) { false };
    };
  };

  func getUserIdForCaller(caller : Principal) : ?Nat {
    principalToUserId.get(caller);
  };

  func addAuditLog(action : Text, user_id : Nat, details : Text) {
    let log : AuditLog = {
      id = nextAuditLogId;
      action = action;
      user_id = user_id;
      timestamp = Time.now();
      details = details;
    };
    auditLogStore.add(nextAuditLogId, log);
    nextAuditLogId += 1;
  };

  // ─── UserProfile (required by instructions) ───────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ─── User Registration ────────────────────────────────────────────────────

  // Register as customer (any authenticated user)
  public shared ({ caller }) func registerCustomer(
    name : Text,
    email : Text,
    phone : Text,
    kyc_doc : ?Storage.ExternalBlob,
  ) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be a registered user to register as customer");
    };
    if (principalToUserId.get(caller) != null) {
      Runtime.trap("User already registered");
    };
    let uid = nextUserId;
    nextUserId += 1;
    let user : User = {
      id = uid;
      principal = caller;
      role = #customer;
      name = name;
      email = email;
      phone = phone;
      kyc_status = false;
      kyc_doc = kyc_doc;
      gst_number = null;
      bank_kyc = null;
    };
    userStore.add(uid, user);
    principalToUserId.add(caller, uid);
    let profile : UserProfile = {
      name = name;
      email = email;
      phone = phone;
      role = #customer;
      kyc_status = false;
      kyc_doc = kyc_doc;
      gst_number = null;
      bank_kyc = null;
    };
    userProfiles.add(caller, profile);
    addAuditLog("registerCustomer", uid, "Customer registered: " # name);
    uid;
  };

  // Register as vendor (any authenticated user; pending admin approval)
  public shared ({ caller }) func registerVendor(
    name : Text,
    email : Text,
    phone : Text,
    gst_number : Text,
    bank_kyc : Text,
  ) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be a registered user to register as vendor");
    };
    if (principalToUserId.get(caller) != null) {
      Runtime.trap("User already registered");
    };
    let uid = nextUserId;
    nextUserId += 1;
    let user : User = {
      id = uid;
      principal = caller;
      role = #vendor;
      name = name;
      email = email;
      phone = phone;
      kyc_status = false;
      kyc_doc = null;
      gst_number = ?gst_number;
      bank_kyc = ?bank_kyc;
    };
    userStore.add(uid, user);
    principalToUserId.add(caller, uid);
    let profile : UserProfile = {
      name = name;
      email = email;
      phone = phone;
      role = #vendor;
      kyc_status = false;
      kyc_doc = null;
      gst_number = ?gst_number;
      bank_kyc = ?bank_kyc;
    };
    userProfiles.add(caller, profile);
    addAuditLog("registerVendor", uid, "Vendor registered: " # name);
    uid;
  };

  // Register as center operator (any authenticated user; pending admin approval)
  public shared ({ caller }) func registerCenter(
    name : Text,
    email : Text,
    phone : Text,
  ) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be a registered user to register as center");
    };
    if (principalToUserId.get(caller) != null) {
      Runtime.trap("User already registered");
    };
    let uid = nextUserId;
    nextUserId += 1;
    let user : User = {
      id = uid;
      principal = caller;
      role = #center;
      name = name;
      email = email;
      phone = phone;
      kyc_status = false;
      kyc_doc = null;
      gst_number = null;
      bank_kyc = null;
    };
    userStore.add(uid, user);
    principalToUserId.add(caller, uid);
    let profile : UserProfile = {
      name = name;
      email = email;
      phone = phone;
      role = #center;
      kyc_status = false;
      kyc_doc = null;
      gst_number = null;
      bank_kyc = null;
    };
    userProfiles.add(caller, profile);
    addAuditLog("registerCenter", uid, "Center registered: " # name);
    uid;
  };

  // ─── Admin: User/KYC Approval ─────────────────────────────────────────────

  public shared ({ caller }) func approveUserKyc(user_id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller) and not isAppAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admin can approve KYC");
    };
    switch (userStore.get(user_id)) {
      case null { Runtime.trap("User not found") };
      case (?u) {
        let updated : User = {
          id = u.id;
          principal = u.principal;
          role = u.role;
          name = u.name;
          email = u.email;
          phone = u.phone;
          kyc_status = true;
          kyc_doc = u.kyc_doc;
          gst_number = u.gst_number;
          bank_kyc = u.bank_kyc;
        };
        userStore.add(user_id, updated);
        addAuditLog("approveUserKyc", user_id, "KYC approved for user: " # user_id.toText());
      };
    };
  };

  public query ({ caller }) func getAllUsers() : async [User] {
    if (not AccessControl.isAdmin(accessControlState, caller) and not isAppAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admin can view all users");
    };
    userStore.values().toArray();
  };

  public query ({ caller }) func getUser(user_id : Nat) : async ?User {
    if (not AccessControl.isAdmin(accessControlState, caller) and not isAppAdmin(caller)) {
      switch (getUserIdForCaller(caller)) {
        case (?uid) {
          if (uid != user_id) {
            Runtime.trap("Unauthorized: Can only view your own user record");
          };
        };
        case null {
          Runtime.trap("Unauthorized: Not registered");
        };
      };
    };
    userStore.get(user_id);
  };

  // ─── Products ─────────────────────────────────────────────────────────────

  // Vendors upload products
  public shared ({ caller }) func uploadProduct(
    name : Text,
    description : Text,
    rental_price : Nat,
    deposit_amount : Nat,
    images : [Storage.ExternalBlob],
  ) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to upload products");
    };
    if (not isAppVendor(caller)) {
      Runtime.trap("Unauthorized: Only vendors can upload products");
    };
    let vendor_id = switch (getUserIdForCaller(caller)) {
      case null { Runtime.trap("Vendor not found") };
      case (?uid) { uid };
    };
    let pid = nextProductId;
    nextProductId += 1;
    let product : Product = {
      id = pid;
      vendor_id = vendor_id;
      center_id = 0;
      name = name;
      description = description;
      rental_price = rental_price;
      deposit_amount = deposit_amount;
      availability_status = #atVendor;
      sanitization_status = false;
      images = images;
      approved = false;
    };
    productStore.add(pid, product);
    addAuditLog("uploadProduct", vendor_id, "Product uploaded: " # name);
    pid;
  };

  // Admin approves product
  public shared ({ caller }) func approveProduct(product_id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller) and not isAppAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admin can approve products");
    };
    switch (productStore.get(product_id)) {
      case null { Runtime.trap("Product not found") };
      case (?p) {
        let updated : Product = {
          id = p.id;
          vendor_id = p.vendor_id;
          center_id = p.center_id;
          name = p.name;
          description = p.description;
          rental_price = p.rental_price;
          deposit_amount = p.deposit_amount;
          availability_status = p.availability_status;
          sanitization_status = p.sanitization_status;
          images = p.images;
          approved = true;
        };
        productStore.add(product_id, updated);
        addAuditLog("approveProduct", 0, "Product approved: " # product_id.toText());
      };
    };
  };

  // Public product browsing
  public query func getProducts(productQueryParam : ?ProductQuery) : async [Product] {
    let all = productStore.values().toArray();
    all.filter(
      func(p : Product) : Bool {
        switch (productQueryParam) {
          case null { p.approved };
          case (?productQuery) {
            var match = true;
            if (productQuery.only_approved) { match := match and p.approved };
            switch (productQuery.center_id) {
              case null {};
              case (?cid) { match := match and (p.center_id == cid) };
            };
            switch (productQuery.status) {
              case null {};
              case (?s) {
                match := match and (
                  switch (p.availability_status, s) {
                    case (#atVendor, #atVendor) { true };
                    case (#atCenter, #atCenter) { true };
                    case (#onTrial, #onTrial) { true };
                    case (#rented, #rented) { true };
                    case (#underSanitization, #underSanitization) { true };
                    case (_, _) { false };
                  }
                );
              };
            };
            switch (productQuery.vendor_id) {
              case null {};
              case (?vid) { match := match and (p.vendor_id == vid) };
            };
            if (productQuery.only_sanitized) { match := match and p.sanitization_status };
            switch (productQuery.min_rental_price) {
              case null {};
              case (?minP) { match := match and (p.rental_price >= minP) };
            };
            switch (productQuery.max_rental_price) {
              case null {};
              case (?maxP) { match := match and (p.rental_price <= maxP) };
            };
            match;
          };
        };
      },
    );
  };

  public query func getProduct(product_id : Nat) : async ?Product {
    productStore.get(product_id);
  };

  // Vendor marks product as sent to a center
  public shared ({ caller }) func submitProductToCenter(product_id : Nat, center_id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    if (not isAppVendor(caller)) {
      Runtime.trap("Unauthorized: Only vendors can submit products to center");
    };
    let vendor_id = switch (getUserIdForCaller(caller)) {
      case null { Runtime.trap("Vendor not found") };
      case (?uid) { uid };
    };
    switch (productStore.get(product_id)) {
      case null { Runtime.trap("Product not found") };
      case (?p) {
        if (p.vendor_id != vendor_id) {
          Runtime.trap("Unauthorized: Product does not belong to this vendor");
        };
        let updated : Product = {
          id = p.id;
          vendor_id = p.vendor_id;
          center_id = center_id;
          name = p.name;
          description = p.description;
          rental_price = p.rental_price;
          deposit_amount = p.deposit_amount;
          availability_status = #atCenter;
          sanitization_status = p.sanitization_status;
          images = p.images;
          approved = p.approved;
        };
        productStore.add(product_id, updated);
        addAuditLog("submitProductToCenter", vendor_id, "Product " # product_id.toText() # " sent to center " # center_id.toText());
      };
    };
  };

  // Center acknowledges receiving product
  public shared ({ caller }) func acknowledgeReceivingProduct(product_id : Nat, center_id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    if (not isAppCenter(caller)) {
      Runtime.trap("Unauthorized: Only center operators can acknowledge product receiving");
    };
    switch (productStore.get(product_id)) {
      case null { Runtime.trap("Product not found") };
      case (?p) {
        if (p.center_id != center_id) {
          Runtime.trap("Product is not assigned to this center");
        };
        let updated : Product = {
          id = p.id;
          vendor_id = p.vendor_id;
          center_id = p.center_id;
          name = p.name;
          description = p.description;
          rental_price = p.rental_price;
          deposit_amount = p.deposit_amount;
          availability_status = #atCenter;
          sanitization_status = p.sanitization_status;
          images = p.images;
          approved = p.approved;
        };
        productStore.add(product_id, updated);
        let center_user_id = switch (getUserIdForCaller(caller)) {
          case null { 0 };
          case (?uid) { uid };
        };
        addAuditLog("acknowledgeReceivingProduct", center_user_id, "Product " # product_id.toText() # " acknowledged at center " # center_id.toText());
      };
    };
  };
};
