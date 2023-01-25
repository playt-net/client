// TODO precision
declare function AnybrainSetCredentials(gk: any, gs: any): void;
declare function AnybrainSetUserId(userId: any): void;
declare function AnybrainStartSDK(): void;
declare function AnybrainStopSDK(): void;
declare function AnybrainPauseSDK(): void;
declare function AnybrainResumeSDK(): void;
declare function AnybrainStartMatch(matchId: any): void;
declare function AnybrainStopMatch(): void;
declare function AnybrainReportError(severity: any, message: any): void;
declare function AnybrainGetErrorDescription(number: any): void;
declare var WorkerMessage: any;
declare var Keyboard: any;
declare var Mouse: any;
declare const anyWorker: Worker;
