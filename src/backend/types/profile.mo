import Common "common";

module {
  public type ExperienceLevel = {
    #fresher;
    #junior;
    #mid;
    #senior;
    #lead;
  };

  public type UserProfile = {
    name : Text;
    age : ?Nat;
    education : ?Text;
    degree : ?Text;
    skills : [Text];
    experienceLevel : ?ExperienceLevel;
    targetRole : ?Text;
    targetCompany : ?Text;
    preferredLanguage : ?Text;
  };
};
