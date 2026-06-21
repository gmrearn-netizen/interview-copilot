import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/session";
import CommonTypes "../types/common";
import SessionLib "../lib/session";

mixin (
  accessControlState : AccessControl.AccessControlState,
  sessions : Map.Map<Principal, List.List<Types.InterviewSession>>,
  sessionCounter : { var value : Nat },
  qaCounter : { var value : Nat },
) {
  public shared ({ caller }) func createInterviewSession(name : Text) : async Types.InterviewSession {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    SessionLib.createSession(sessions, sessionCounter, caller, name);
  };

  public query ({ caller }) func listInterviewSessions() : async [Types.SessionSummary] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    SessionLib.listSessions(sessions, caller);
  };

  public query ({ caller }) func getInterviewSession(sessionId : CommonTypes.SessionId) : async ?Types.InterviewSession {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    SessionLib.getSession(sessions, caller, sessionId);
  };

  public shared ({ caller }) func deleteInterviewSession(sessionId : CommonTypes.SessionId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    SessionLib.deleteSession(sessions, caller, sessionId);
  };

  public shared ({ caller }) func addQAPairToSession(
    sessionId : CommonTypes.SessionId,
    question : Text,
    answer : Text,
  ) : async ?Types.QAPair {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    SessionLib.addQAPair(sessions, qaCounter, caller, sessionId, question, answer);
  };
};
