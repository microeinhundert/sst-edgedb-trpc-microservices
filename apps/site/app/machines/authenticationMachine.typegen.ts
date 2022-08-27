// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  "internalEvents": {
    "done.invoke.checkToken": {
      type: "done.invoke.checkToken";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.getToken": {
      type: "done.invoke.getToken";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.getUserInfo": {
      type: "done.invoke.getUserInfo";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.refreshToken": {
      type: "done.invoke.refreshToken";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.setSession": {
      type: "done.invoke.setSession";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.checkToken": { type: "error.platform.checkToken"; data: unknown };
    "error.platform.getToken": { type: "error.platform.getToken"; data: unknown };
    "error.platform.getUserInfo": { type: "error.platform.getUserInfo"; data: unknown };
    "error.platform.refreshToken": { type: "error.platform.refreshToken"; data: unknown };
    "error.platform.setSession": { type: "error.platform.setSession"; data: unknown };
    "xstate.init": { type: "xstate.init" };
  };
  "invokeSrcNameMap": {
    checkToken: "done.invoke.checkToken";
    getToken: "done.invoke.getToken";
    getUserInfo: "done.invoke.getUserInfo";
    refreshToken: "done.invoke.refreshToken";
    setSession: "done.invoke.setSession";
  };
  "missingImplementations": {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  "eventsCausingActions": {
    doRedirect:
      | "CHECK"
      | "error.platform.getToken"
      | "error.platform.getUserInfo"
      | "error.platform.refreshToken"
      | "error.platform.setSession";
  };
  "eventsCausingServices": {
    checkToken: "CHECK";
    getToken: "CHECK";
    getUserInfo: "done.invoke.checkToken" | "done.invoke.getToken" | "done.invoke.refreshToken";
    refreshToken: "error.platform.checkToken";
    setSession: "done.invoke.getUserInfo";
  };
  "eventsCausingGuards": {
    hasCode: "CHECK";
    hasSession: "CHECK";
  };
  "eventsCausingDelays": {};
  "matchesStates":
    | "authenticationFailed"
    | "authenticationSucceeded"
    | "checkingToken"
    | "gettingToken"
    | "gettingUserInfo"
    | "initial"
    | "refreshingToken"
    | "settingSession";
  "tags": never;
}
