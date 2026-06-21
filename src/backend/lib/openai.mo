import { defaultConfig; type Config } "mo:openai-client/Config";
import ChatApi "mo:openai-client/Apis/ChatApi";
import CreateChatCompletionRequest "mo:openai-client/Models/CreateChatCompletionRequest";
import ChatCompletionRequestUserMessage "mo:openai-client/Models/ChatCompletionRequestUserMessage";
import Runtime "mo:core/Runtime";

module {
  public func configForKey(key : Text) : Config {
    {
      defaultConfig with
      auth = ?#bearer key;
      is_replicated = ?false;
    };
  };

  public func runChatCompletion(config : Config, prompt : Text) : async* Text {
    let userMessage = ChatCompletionRequestUserMessage.JSON.init({
      content = #string(prompt);
      role = #user;
    });

    let req = CreateChatCompletionRequest.JSON.init({
      messages = [#user(userMessage)];
      model = "gpt-4o-mini";
    });

    let resp = await* ChatApi.createChatCompletion(config, req);

    if (resp.choices.size() == 0) {
      Runtime.trap("OpenAI returned no choices");
    };
    switch (resp.choices[0].message.content) {
      case (?text) text;
      case null Runtime.trap("OpenAI returned no text content");
    };
  };

  public func generateAnswer(config : Config, question : Text, profile : Text) : async* Text {
    let prompt = "You are an AI interview coach. The user is preparing for a job interview.\n\nUser Profile:\n" # profile # "\n\nInterview Question:\n" # question # "\n\nProvide a natural, humanized answer in Hindi (Hinglish) that the user can use during their interview. Keep it concise, professional, and relevant to their target role.";
    await* runChatCompletion(config, prompt);
  };

  public func regenerateAnswer(config : Config, question : Text, profile : Text, previousAnswer : Text) : async* Text {
    let prompt = "You are an AI interview coach. The user is preparing for a job interview.\n\nUser Profile:\n" # profile # "\n\nInterview Question:\n" # question # "\n\nPrevious Answer:\n" # previousAnswer # "\n\nProvide an alternative, natural, humanized answer in Hindi (Hinglish) with a different approach or phrasing. Keep it concise, professional, and relevant to their target role.";
    await* runChatCompletion(config, prompt);
  };
};
