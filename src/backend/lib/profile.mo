import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Types "../types/profile";

module {
  public type UserProfile = Types.UserProfile;

  public func getProfile(userProfiles : Map.Map<Principal, Types.UserProfile>, caller : Principal) : ?Types.UserProfile {
    userProfiles.get(caller);
  };

  public func saveProfile(userProfiles : Map.Map<Principal, Types.UserProfile>, caller : Principal, profile : Types.UserProfile) : () {
    userProfiles.add(caller, profile);
  };
};
