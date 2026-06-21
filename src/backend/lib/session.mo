import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Types "../types/session";
import CommonTypes "../types/common";
import Array "mo:core/Array";
import Int "mo:core/Int";

module {
  public type InterviewSession = Types.InterviewSession;
  public type QAPair = Types.QAPair;
  public type SessionSummary = Types.SessionSummary;

  public func createSession(
    sessions : Map.Map<Principal, List.List<Types.InterviewSession>>,
    sessionCounter : { var value : Nat },
    caller : Principal,
    name : Text,
  ) : Types.InterviewSession {
    let id = sessionCounter.value;
    sessionCounter.value += 1;

    let session : Types.InterviewSession = {
      id;
      name;
      createdAt = Time.now().toNat();
      qaPairs = [];
    };

    switch (sessions.get(caller)) {
      case (?userSessions) {
        userSessions.add(session);
        sessions.add(caller, userSessions);
      };
      case null {
        let newList = List.empty<Types.InterviewSession>();
        newList.add(session);
        sessions.add(caller, newList);
      };
    };

    session;
  };

  public func listSessions(
    sessions : Map.Map<Principal, List.List<Types.InterviewSession>>,
    caller : Principal,
  ) : [Types.SessionSummary] {
    switch (sessions.get(caller)) {
      case (?userSessions) {
        List.toArray(userSessions.map<Types.InterviewSession, Types.SessionSummary>(func(s) {
            {
              id = s.id;
              name = s.name;
              createdAt = s.createdAt;
              qaCount = s.qaPairs.size();
            };
          }
        ));
      };
      case null { [] };
    };
  };

  public func getSession(
    sessions : Map.Map<Principal, List.List<Types.InterviewSession>>,
    caller : Principal,
    sessionId : CommonTypes.SessionId,
  ) : ?Types.InterviewSession {
    switch (sessions.get(caller)) {
      case (?userSessions) {
        userSessions.find(func(s) { s.id == sessionId });
      };
      case null { null };
    };
  };

  public func deleteSession(
    sessions : Map.Map<Principal, List.List<Types.InterviewSession>>,
    caller : Principal,
    sessionId : CommonTypes.SessionId,
  ) : Bool {
    switch (sessions.get(caller)) {
      case (?userSessions) {
        let initialSize = userSessions.size();
        userSessions.retain(func(s) { s.id != sessionId });
        let newSize = userSessions.size();
        if (newSize < initialSize) {
          sessions.add(caller, userSessions);
          true;
        } else {
          false;
        };
      };
      case null { false };
    };
  };

  public func addQAPair(
    sessions : Map.Map<Principal, List.List<Types.InterviewSession>>,
    qaCounter : { var value : Nat },
    caller : Principal,
    sessionId : CommonTypes.SessionId,
    question : Text,
    answer : Text,
  ) : ?Types.QAPair {
    let qaId = qaCounter.value;
    qaCounter.value += 1;

    let qaPair : Types.QAPair = {
      id = qaId;
      question;
      answer;
      timestamp = Time.now().toNat();
    };

    switch (sessions.get(caller)) {
      case (?userSessions) {
        let updated = userSessions.map<Types.InterviewSession, Types.InterviewSession>(func(s) {
            if (s.id == sessionId) {
              let newPairs = Array.tabulate(s.qaPairs.size() + 1, func(i) { if (i < s.qaPairs.size()) { s.qaPairs[i] } else { qaPair } });
              { s with qaPairs = newPairs };
            } else {
              s;
            };
          }
        );
        sessions.add(caller, updated);
        ?qaPair;
      };
      case null { null };
    };
  };
};
