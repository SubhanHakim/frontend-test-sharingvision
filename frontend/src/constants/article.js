export const STATUS = {
  PUBLISH: 'publish',
  DRAFT: 'draft',
  TRASH: 'thrash',
};

export const TABS = [
  { status: STATUS.PUBLISH, label: 'Published' },
  { status: STATUS.DRAFT, label: 'Drafts' },
  { status: STATUS.TRASH, label: 'Trashed' },
];

export const PREVIEW_PER_PAGE = 5;

// ponytail: tabel dashboard memuat sekaligus; tambahkan pagination bila artikel > 100
export const DASHBOARD_LIMIT = 100;
