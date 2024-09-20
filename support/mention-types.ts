import { RootState, PayloadAction, KeyOffsetsTuple, MentionMatch } from 'foo';

export interface FindWithRegexCb {
  (start: number, end: number): void;
}

type uuid = string;
type ServiceUserId = uuid;

interface UserListIdentifier {
  resourceId: ServiceUserId;
  displayName: string | null;
  resource: "user" | "list";
}

export type MentionPluginReducersSelectors = {
  reducers: {
    mentionStaged: (payload: UserListIdentifier) => PayloadAction<any, string>;
    mentionInitiated: () => PayloadAction<any, string>;
    mentionKeyboardFocusChanged: (payload: number) => PayloadAction<any, string>;
    mentionMatchEntered: (payload: MentionMatch) => PayloadAction<any, string>;
    mentionMatchExited: () => PayloadAction<any, string>;
  };
  selectors: {
    keyword: (state: RootState) => string | false;
    dropdownIndex: (state: RootState) => number | false;
    cursorKeyAndOffsets: (state: RootState) => KeyOffsetsTuple | false;
  };
};
