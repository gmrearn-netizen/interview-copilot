import Map "mo:core/Map";
import List "mo:core/List";

module {
  type OldActor = {};

  type NewActor = {
    var accessControlState : { var adminAssigned : Bool; userRoles : Map.Map<Principal, { #admin; #user; #guest }> };
    var userProfiles : Map.Map<Principal, { name : Text; age : ?Nat; education : ?Text; degree : ?Text; skills : [Text]; experienceLevel : ?{ #fresher; #junior; #mid; #senior; #lead }; targetRole : ?Text; targetCompany : ?Text; preferredLanguage : ?Text }>;
    var sessions : Map.Map<Principal, List.List<{ id : Nat; name : Text; createdAt : Nat; qaPairs : [{ id : Nat; question : Text; answer : Text; timestamp : Nat }] }>>;
    var openAIKeys : Map.Map<Principal, Text>;
    var sessionCounter : { var value : Nat };
    var qaCounter : { var value : Nat };
  };

  public func migration(_old : OldActor) : NewActor {
    {
      var accessControlState = { var adminAssigned = false; userRoles = Map.empty<Principal, { #admin; #user; #guest }>() };
      var userProfiles = Map.empty<Principal, { name : Text; age : ?Nat; education : ?Text; degree : ?Text; skills : [Text]; experienceLevel : ?{ #fresher; #junior; #mid; #senior; #lead }; targetRole : ?Text; targetCompany : ?Text; preferredLanguage : ?Text }>();
      var sessions = Map.empty<Principal, List.List<{ id : Nat; name : Text; createdAt : Nat; qaPairs : [{ id : Nat; question : Text; answer : Text; timestamp : Nat }] }>>();
      var openAIKeys = Map.empty<Principal, Text>();
      var sessionCounter = { var value = 0 };
      var qaCounter = { var value = 0 };
    };
  };
};
