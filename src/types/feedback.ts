export interface FeedbackVO {
  id: string;
  type: string;
  content: string;
  status: string;
  submitTime?: string;
  processTime?: string;
}

export interface FeedbackDetailVO extends FeedbackVO {
  contact?: string;
  followUps?: FeedbackFollowUpVO[];
}

export interface FeedbackFollowUpVO {
  id: string;
  content: string;
  createTime: string;
}

export interface ReportVO {
  id: string;
  type: string;
  targetId: string;
  status: string;
  submitTime?: string;
  processTime?: string;
}

export interface ReportDetailVO extends ReportVO {
  content?: string;
}

export interface FaqCategoryVO {
  id: string;
  name: string;
  icon?: string;
  sortOrder?: number;
}

export interface FaqVO {
  id: string;
  question: string;
  categoryId?: string;
  viewCount?: number;
  helpfulCount?: number;
}

export interface FaqDetailVO extends FaqVO {
  answer?: string;
}

export interface TutorialVO {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  viewCount?: number;
}

export interface TutorialDetailVO extends TutorialVO {
  content?: string;
}

export interface OnboardingStepVO {
  id: string;
  title: string;
  description?: string;
  order: number;
  completed: boolean;
}

export interface SupportInfoVO {
  hotline?: string;
  email?: string;
  workingHours?: string;
  wechatQrcode?: string;
  onlineSupportUrl?: string;
}

export interface SupportMessageVO {
  id: string;
  content: string;
  senderType: string;
  sendTime: string;
}

export interface FeedbackSubmitRequest {
  type: string;
  content: string;
  contact?: string;
  attachmentUrl?: string;
  screenshotUrl?: string;
}

export interface FeedbackQuery {
  type?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface FeedbackFollowUpRequest {
  content: string;
}

export interface ReportSubmitRequest {
  type: string;
  targetId: string;
  content: string;
}

export interface ReportQuery {
  page?: number;
  size?: number;
}

export interface FaqQuery {
  categoryId?: string;
  page?: number;
  size?: number;
}

export interface TutorialQuery {
  page?: number;
  size?: number;
}

export interface SupportMessageRequest {
  content: string;
}

export interface SupportMessageQuery {
  page?: number;
  size?: number;
}

export interface FeedbackModule {
  submit(request: FeedbackSubmitRequest): Promise<FeedbackVO>;
  list(query: FeedbackQuery): Promise<FeedbackVO[]>;
  getById(feedbackId: string): Promise<FeedbackDetailVO>;
  followUp(feedbackId: string, request: FeedbackFollowUpRequest): Promise<FeedbackDetailVO>;
  close(feedbackId: string, reason?: string): Promise<FeedbackDetailVO>;
  submitReport(request: ReportSubmitRequest): Promise<ReportVO>;
  listReports(query: ReportQuery): Promise<ReportVO[]>;
  getReportById(reportId: string): Promise<ReportDetailVO>;
  listFaqCategories(): Promise<FaqCategoryVO[]>;
  listFaqs(query: FaqQuery): Promise<FaqVO[]>;
  searchFaqs(keyword: string): Promise<FaqVO[]>;
  getFaqById(faqId: string): Promise<FaqDetailVO>;
  likeFaq(faqId: string): Promise<void>;
  dislikeFaq(faqId: string): Promise<void>;
  listTutorials(query: TutorialQuery): Promise<TutorialVO[]>;
  getTutorialById(tutorialId: string): Promise<TutorialDetailVO>;
  getOnboardingGuide(): Promise<OnboardingStepVO[]>;
  completeOnboardingStep(stepId: string): Promise<void>;
  getSupportInfo(): Promise<SupportInfoVO>;
  sendSupportMessage(request: SupportMessageRequest): Promise<SupportMessageVO>;
  listSupportMessages(query: SupportMessageQuery): Promise<SupportMessageVO[]>;
}
