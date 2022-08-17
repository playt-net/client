/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/api/live/channels': {
    /** The playerToken identifies a player in a match. */
    get: {
      parameters: {
        path: {
          playerToken: string;
        };
      };
      responses: {
        200: {
          content: {
            'application/json': {
              channelName: string;
              appKey: string;
            };
          };
        };
      };
    };
  };
  '/api/matches/scores': {
    /** The score depends on the game and should be an accumulated score of the user at a given time. Previously submitted scores will be ignored when a player has surrendered or is timed out. Submitting a final score or surrendering will finalise the match for the given player and no subsequent updates can be posted. */
    post: {
      responses: {
        200: {
          content: {
            'application/json': {
              /** @enum {string} */
              message: 'success';
            };
          };
        };
      };
      requestBody: {
        content: {
          'application/json': {
            playerToken: string;
            score: number;
            finalSnapshot?: boolean | null;
            surrender?: boolean | null;
          };
        };
      };
    };
  };
  '/api/matches/search': {
    /** The playerToken identifies a player in a match. The returned match includes additional information about the requested player. */
    post: {
      responses: {
        200: {
          content: {
            'application/json': {
              id: string;
              gameId: string;
              gameTitle: string;
              /** @enum {string} */
              matchTier: 'tutorial' | '1vs1' | '5p' | '10p' | 'tournament';
              requiredPlayers: number;
              /** @enum {string} */
              matchState: 'running' | 'finished';
              finishedAt?: string | null;
              denominationTier: string;
              players: {
                userId: string;
                name: string;
                avatarUrl?: string;
                didNotFinish?: boolean | null;
                scoreSnapshots: {
                  score: number;
                  timestamp: string;
                }[];
                finalScore?: number | null;
                ranking?: number | null;
                replayId?: string | null;
                earnings?:
                  | {
                      amount: number;
                      /** @enum {string} */
                      type: 'coins';
                    }[]
                  | null;
              }[];
              player: {
                userId: string;
                name: string;
                avatarUrl?: string;
                playerToken: string;
                didNotFinish?: boolean | null;
                scoreSnapshots: {
                  score: number;
                  timestamp: string;
                }[];
                finalScore?: number | null;
                ranking?: number | null;
                replayId?: string | null;
                earnings?:
                  | {
                      amount: number;
                      /** @enum {string} */
                      type: 'coins';
                    }[]
                  | null;
              };
              entryCost: {
                /** @enum {string} */
                identifier: 'coins';
                amount: number;
              };
              createdAt: string;
              updatedAt: string;
            };
          };
        };
      };
      requestBody: {
        content: {
          'application/json': {
            playerToken?: string | null;
            matchId?: string | null;
          };
        };
      };
    };
  };
  '/api/replays': {
    /** The replay is in the stringified payload which is sent before via the POST request. */
    get: {
      parameters: {
        path: {
          matchId: string;
          userId: string;
        };
      };
      responses: {
        200: {
          content: {
            'application/json': {
              id: string;
              matchId: string;
              userId: string;
              name: string;
              payload: string;
              createdAt: string;
            };
          };
        };
      };
    };
    /** You have full control about the replay. We expect a stringified replay. */
    post: {
      responses: {
        200: {
          content: {
            'application/json': {
              replayId: string;
            };
          };
        };
      };
      requestBody: {
        content: {
          'application/json': {
            playerToken: string;
            payload: string;
          };
        };
      };
    };
  };
  '/api/tutorials/scores': {
    /** The score depends on the game and should be an accumulated score of the user at a given time. Previously submitted scores will be ignored when a player has surrendered or is timed out. Submitting a final score or surrendering will finalise the match for the given player and no subsequent updates can be posted. */
    post: {
      responses: {
        200: {
          content: {
            'application/json': {
              /** @enum {string} */
              message: 'success';
            };
          };
        };
      };
      requestBody: {
        content: {
          'application/json': {
            playerToken: string;
            score: number;
            finalSnapshot?: boolean | null;
            surrender?: boolean | null;
          };
        };
      };
    };
  };
}

export interface components {}

export interface operations {}

export interface external {}
