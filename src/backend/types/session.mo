import Common "common";

module {
  public type QAPair = {
    id : Common.QAPairId;
    question : Text;
    answer : Text;
    timestamp : Common.Timestamp;
  };

  public type InterviewSession = {
    id : Common.SessionId;
    name : Text;
    createdAt : Common.Timestamp;
    qaPairs : [QAPair];
  };

  public type SessionSummary = {
    id : Common.SessionId;
    name : Text;
    createdAt : Common.Timestamp;
    qaCount : Nat;
  };
};
