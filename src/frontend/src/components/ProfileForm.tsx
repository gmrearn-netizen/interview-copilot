import { ExperienceLevel } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile, useSaveProfile } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Plus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

const experienceOptions: ExperienceLevel[] = [
  ExperienceLevel.fresher,
  ExperienceLevel.junior,
  ExperienceLevel.mid,
  ExperienceLevel.senior,
  ExperienceLevel.lead,
];

export function ProfileForm() {
  const { data: profile, isLoading } = useProfile();
  const saveMutation = useSaveProfile();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("");
  const [degree, setDegree] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [preferredLanguage, setPreferredLanguage] =
    useState("Hindi (Hinglish)");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    ExperienceLevel.fresher,
  );
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setAge(profile.age ? String(profile.age) : "");
      setEducation(profile.education || "");
      setDegree(profile.degree || "");
      setTargetRole(profile.targetRole || "");
      setTargetCompany(profile.targetCompany || "");
      setPreferredLanguage(profile.preferredLanguage || "Hindi (Hinglish)");
      setExperienceLevel(profile.experienceLevel || ExperienceLevel.fresher);
      setSkills(profile.skills || []);
    }
  }, [profile]);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput("");
    }
  };

  const removeSkill = (s: string) => {
    setSkills(skills.filter((x) => x !== s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveMutation.mutateAsync({
      name,
      age: age ? BigInt(age) : undefined,
      education: education || undefined,
      degree: degree || undefined,
      targetRole: targetRole || undefined,
      targetCompany: targetCompany || undefined,
      preferredLanguage: preferredLanguage || undefined,
      experienceLevel,
      skills,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map(() => (
            <div
              key={crypto.randomUUID()}
              className="h-10 bg-muted rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            data-ocid="profile.name_input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Aapka naam"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            data-ocid="profile.age_input"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Umar"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="education">Education</Label>
          <Input
            id="education"
            data-ocid="profile.education_input"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="e.g. B.Tech, MBA"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="degree">Degree</Label>
          <Input
            id="degree"
            data-ocid="profile.degree_input"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            placeholder="e.g. Computer Science"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetRole">Target Role</Label>
          <Input
            id="targetRole"
            data-ocid="profile.target_role_input"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Software Engineer"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetCompany">Target Company</Label>
          <Input
            id="targetCompany"
            data-ocid="profile.target_company_input"
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
            placeholder="e.g. Google, Amazon"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredLanguage">Preferred Language</Label>
          <Input
            id="preferredLanguage"
            data-ocid="profile.language_input"
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
            placeholder="e.g. Hindi (Hinglish)"
          />
        </div>
        <div className="space-y-2">
          <Label>Experience Level</Label>
          <div className="flex flex-wrap gap-2">
            {experienceOptions.map((level) => (
              <button
                key={level}
                data-ocid={`profile.experience_${level}.radio`}
                type="button"
                onClick={() => setExperienceLevel(level)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium border transition-smooth",
                  experienceLevel === level
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground",
                )}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Skills</Label>
        <div className="flex items-center gap-2">
          <Input
            data-ocid="profile.skill_input"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Add a skill and press Enter"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addSkill}
            data-ocid="profile.add_skill_button"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1">
              {skill}
              <button
                data-ocid={`profile.remove_skill_${skill}.button`}
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:text-destructive transition-smooth"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          data-ocid="profile.save_button"
          disabled={saveMutation.isPending}
          className="gap-2"
        >
          {saveMutation.isPending ? (
            <span className="animate-pulse">Saving...</span>
          ) : saved ? (
            <>
              <Save className="w-4 h-4" /> Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
