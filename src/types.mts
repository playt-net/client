/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/api/matches/{matchId}': {
    /** Search a match based on match id. Matches are public. */
    get: {
      parameters: {
        path: {
          /** The matchId is the same for all players in the match and is not to be confused with the gameId, userId, or playerToken (which is per-player per-match). */
          matchId: string;
        };
      };
      responses: {
        200: {
          content: {
            'application/json': {
              id: string;
              game: {
                antiCheat: {
                  gameKey: string;
                  gameSecret: string;
                };
              };
            };
          };
        };
        /** No match exists for this matchId */
        404: unknown;
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
            timestamp?: string | null;
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
              matchTier: {
                playerCount: number;
              };
              /** @enum {string} */
              status: 'running' | 'finished';
              players: {
                userId: string;
                name: string;
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
                replayId?: string;
                scoreSnapshots: {
                  score: number;
                  timestamp: string;
                }[];
              }[];
              player?: {
                userId: string;
                name: string;
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
                replayId?: string;
                scoreSnapshots: {
                  score: number;
                  timestamp: string;
                }[];
              } | null;
              dueDate?: string;
              /** @enum {number} */
              difficulty: 0 | 1 | 2 | 3;
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
  '/api/matches/quit': {
    /** If the quitGame value is true , the iframe with the game will be closed */
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
              payload: string;
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
  '/api/anybrain/info': {
    /** Retrieves the user and match id for a given player token */
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
              userId: string;
              matchId: string;
            };
          };
        };
      };
    };
  };
}

export interface components {}

export interface operations {}

export interface external {}
