import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinViews "mo:caffeineai-data-viewer/MixinViews";
import ProfileTypes "types/profile";
import SessionTypes "types/session";
import ProfileMixin "mixins/profile-api";
import SessionMixin "mixins/session-api";
import OpenAIChatMixin "mixins/openai-chat";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  let userProfiles : Map.Map<Principal, ProfileTypes.UserProfile>;
  include ProfileMixin(accessControlState, userProfiles);

  let sessions : Map.Map<Principal, List.List<SessionTypes.InterviewSession>>;
  let sessionCounter : { var value : Nat };
  let qaCounter : { var value : Nat };
  include SessionMixin(accessControlState, sessions, sessionCounter, qaCounter);

  let openAIKeys : Map.Map<Principal, Text>;
  include OpenAIChatMixin(accessControlState, openAIKeys, userProfiles);

  include MixinViews();
}
