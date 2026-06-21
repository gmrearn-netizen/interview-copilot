import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import OpenAI "../lib/openai";
import ProfileTypes "../types/profile";

mixin (
  accessControlState : AccessControl.AccessControlState,
  openAIKeys : Map.Map<Principal, Text>,
  userProfiles : Map.Map<Principal, ProfileTypes.UserProfile>,
) {
  public query ({ caller }) func isMyOpenAIConfigured() : async Bool {
    openAIKeys.containsKey(caller);
  };

  public shared ({ caller }) func setMyOpenAIApiKey(key : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Sign in to use this feature");
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    openAIKeys.add(caller, key);
  };

  public shared ({ caller }) func clearMyOpenAIApiKey() : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Sign in to use this feature");
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    openAIKeys.remove(caller);
  };

  public shared ({ caller }) func generateInterviewAnswer(question : Text) : async Text {
    if (caller.isAnonymous()) {
      Runtime.trap("Sign in to use this feature");
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let ?key = openAIKeys.get(caller) else {
      Runtime.trap("Set your OpenAI API key first");
    };

    let profileText = switch (userProfiles.get(caller)) {
      case (?profile) {
        let name = profile.name;
        let role = switch (profile.targetRole) {
          case (?r) r;
          case null "Not specified";
        };
        let company = switch (profile.targetCompany) {
          case (?c) c;
          case null "Not specified";
        };
        let skills = if (profile.skills.size() > 0) {
          profile.skills[0];
        } else {
          "Not specified";
        };
        "Name: " # name # ", Target Role: " # role # ", Target Company: " # company # ", Skills: " # skills;
      };
      case null {
        "No profile set. Please set up your profile first.";
      };
    };

    await* OpenAI.generateAnswer(OpenAI.configForKey(key), question, profileText);
  };

  public shared ({ caller }) func regenerateInterviewAnswer(question : Text, previousAnswer : Text) : async Text {
    if (caller.isAnonymous()) {
      Runtime.trap("Sign in to use this feature");
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let ?key = openAIKeys.get(caller) else {
      Runtime.trap("Set your OpenAI API key first");
    };

    let profileText = switch (userProfiles.get(caller)) {
      case (?profile) {
        let name = profile.name;
        let role = switch (profile.targetRole) {
          case (?r) r;
          case null "Not specified";
        };
        let company = switch (profile.targetCompany) {
          case (?c) c;
          case null "Not specified";
        };
        let skills = if (profile.skills.size() > 0) {
          profile.skills[0];
        } else {
          "Not specified";
        };
        "Name: " # name # ", Target Role: " # role # ", Target Company: " # company # ", Skills: " # skills;
      };
      case null {
        "No profile set. Please set up your profile first.";
      };
    };

    await* OpenAI.regenerateAnswer(OpenAI.configForKey(key), question, profileText, previousAnswer);
  };
};
