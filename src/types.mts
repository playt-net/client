/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/api/games/{gameId}/sentry-config': {
    get: operations['sentryConfig'];
  };
  '/api/games/{gameId}/anti-cheat-config': {
    get: operations['antiCheatConfig'];
  };
  '/api/matches/scores': {
    /** The score depends on the game and should be an accumulated score of the user at a given time. Previously submitted scores will be ignored when a player has surrendered or is timed out. Submitting a final score or surrendering will finalize the match for the given player and no subsequent updates can be posted. */
    post: operations['addScore'];
  };
  '/api/anybrain/info': {
    /** To be used by external anti-cheat service anybrain */
    get: operations['playerInfo'];
  };
  '/api/matches/{matchId}': {
    /** To be used by the browser api when starting a game. */
    get: operations['antiCheatCredentials'];
  };
  '/api/matches/quit': {
    /** If the quitGame value is true, the iframe with the game will be closed */
    post: operations['quitMatch'];
  };
  '/api/matches/search': {
    /** The playerToken identifies a player in a match. The returned match includes additional information about the requesting player. */
    post: operations['searchMatch'];
  };
  '/api/replays': {
    get: operations['getReplay'];
    /** The replayId is returned as a response and can be used to retrieve the replay. We expect a stringified replay. */
    post: operations['addReplay'];
  };
}

export interface components {
  responses: {
    /** Error response */
    error: {
      content: {
        'application/json': {
          message: string;
          code: string;
          issues?: {
            message: string;
          }[];
        };
      };
    };
  };
}

export interface operations {
  sentryConfig: {
    parameters: {
      path: {
        gameId: string;
      };
    };
    responses: {
      /** Successful response */
      200: {
        content: {
          'application/json': {
            /** Format: uri */
            dsn?: string | null;
            /** @default 1 */
            tracesSampleRate?: number;
            /** @default 0.001 */
            replaysSessionSampleRate?: number;
            /** @default 0.1 */
            replaysOnErrorSampleRate?: number;
          };
        };
      };
      default: components['responses']['error'];
    };
  };
  antiCheatConfig: {
    parameters: {
      path: {
        gameId: string;
      };
    };
    responses: {
      /** Successful response */
      200: {
        content: {
          'application/json': {
            gameKey: string;
            gameSecret: string;
          };
        };
      };
      default: components['responses']['error'];
    };
  };
  /** The score depends on the game and should be an accumulated score of the user at a given time. Previously submitted scores will be ignored when a player has surrendered or is timed out. Submitting a final score or surrendering will finalize the match for the given player and no subsequent updates can be posted. */
  addScore: {
    parameters: {};
    responses: {
      /** Successful response */
      200: {
        content: {
          'application/json': {
            /** @enum {string} */
            message: 'success';
          };
        };
      };
      default: components['responses']['error'];
    };
    requestBody: {
      content: {
        'application/json': {
          playerToken: string;
          score: number;
          finalSnapshot?: boolean;
          surrender?: boolean;
          timestamp?: string;
        };
      };
    };
  };
  /** To be used by external anti-cheat service anybrain */
  playerInfo: {
    parameters: {
      query: {
        playerToken: string;
      };
    };
    responses: {
      /** Successful response */
      200: {
        content: {
          'application/json': {
            userId: string;
            matchId: string;
          };
        };
      };
      default: components['responses']['error'];
    };
  };
  /** To be used by the browser api when starting a game. */
  antiCheatCredentials: {
    parameters: {
      path: {
        matchId: string;
      };
    };
    responses: {
      /** Successful response */
      200: {
        content: {
          'application/json': {
            game: {
              gameId: string;
              antiCheat: {
                gameKey: string;
                gameSecret: string;
              };
            };
            _id?: unknown;
          };
        };
      };
      default: components['responses']['error'];
    };
  };
  /** If the quitGame value is true, the iframe with the game will be closed */
  quitMatch: {
    parameters: {};
    responses: {
      /** Successful response */
      200: {
        content: {
          'application/json': {
            /** @enum {string} */
            message: 'success';
          };
        };
      };
      default: components['responses']['error'];
    };
    requestBody: {
      content: {
        'application/json': {
          playerToken: string;
        };
      };
    };
  };
  /** The playerToken identifies a player in a match. The returned match includes additional information about the requesting player. */
  searchMatch: {
    parameters: {};
    responses: {
      /** Successful response */
      200: {
        content: {
          'application/json': {
            player?: {
              userId: string;
              avatar: {
                url: string;
                /** @enum {string} */
                backgroundColor:
                  | '#FFAA7A'
                  | '#A9FF94'
                  | '#D694FF'
                  | '#94BFFF'
                  | '#7EFFD1'
                  | '#FFDB7E'
                  | '#FF7E7E';
              };
              name: string;
              scoreSnapshots: {
                score: number;
                /** Format: date-time */
                timestamp: string;
              }[];
              replayId?: string;
            };
            players: {
              userId: string;
              avatar: {
                url: string;
                /** @enum {string} */
                backgroundColor:
                  | '#FFAA7A'
                  | '#A9FF94'
                  | '#D694FF'
                  | '#94BFFF'
                  | '#7EFFD1'
                  | '#FFDB7E'
                  | '#FF7E7E';
              };
              name: string;
              scoreSnapshots: {
                score: number;
                /** Format: date-time */
                timestamp: string;
              }[];
              replayId?: string;
            }[];
            /** @enum {string} */
            status: 'running' | 'finished' | 'cancelled';
            /** Format: date-time */
            dueDate: string;
            matchTier: {
              playerCount: number;
              /** @enum {string} */
              type: 'match' | 'tournament' | 'tutorial';
            };
            difficulty: Partial<Partial<Partial<0> & Partial<1>> & Partial<2>> &
              Partial<3>;
            _id?: unknown;
          };
        };
      };
      default: components['responses']['error'];
    };
    requestBody: {
      content: {
        'application/json': {
          matchId?: string;
          playerToken?: string;
        };
      };
    };
  };
  getReplay: {
    parameters: {
      query: {
        matchId: string;
        userId: string;
      };
    };
    responses: {
      /** Successful response */
      200: {
        content: {
          'application/json': {
            id: string;
            payload: string;
          };
        };
      };
      default: components['responses']['error'];
    };
  };
  /** The replayId is returned as a response and can be used to retrieve the replay. We expect a stringified replay. */
  addReplay: {
    parameters: {};
    responses: {
      /** Successful response */
      200: {
        content: {
          'application/json': {
            replayId: string;
          };
        };
      };
      default: components['responses']['error'];
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
}

export interface external {}
