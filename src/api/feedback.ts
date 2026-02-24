import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';
import type {
  FeedbackVO,
  FeedbackDetailVO,
  ReportVO,
  ReportDetailVO,
  FaqCategoryVO,
  FaqVO,
  FaqDetailVO,
  TutorialVO,
  TutorialDetailVO,
  OnboardingStepVO,
  SupportInfoVO,
  SupportMessageVO,
  FeedbackSubmitRequest,
  FeedbackQuery,
  FeedbackFollowUpRequest,
  ReportSubmitRequest,
  ReportQuery,
  FaqQuery,
  TutorialQuery,
  SupportMessageRequest,
  SupportMessageQuery,
  FeedbackModule,
} from '../types/feedback';
import type { PageResult } from '../types/common';

export class FeedbackApi implements FeedbackModule {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async submit(request: FeedbackSubmitRequest): Promise<FeedbackVO> {
    return this.client.post<FeedbackVO>(appApiPath('/feedback'), request);
  }

  async list(query: FeedbackQuery): Promise<FeedbackVO[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      type: query.type,
      status: query.status,
      page: query.page,
      size: query.size,
    };
    const result = await this.client.get<PageResult<FeedbackVO>>(appApiPath('/feedback'), params);
    return result.content;
  }

  async getById(feedbackId: string): Promise<FeedbackDetailVO> {
    return this.client.get<FeedbackDetailVO>(appApiPath(`/feedback/${feedbackId}`));
  }

  async followUp(feedbackId: string, request: FeedbackFollowUpRequest): Promise<FeedbackDetailVO> {
    return this.client.post<FeedbackDetailVO>(appApiPath(`/feedback/${feedbackId}/followup`), request);
  }

  async close(feedbackId: string, reason?: string): Promise<FeedbackDetailVO> {
    return this.client.put<FeedbackDetailVO>(appApiPath(`/feedback/${feedbackId}/close`), undefined, { reason });
  }

  async submitReport(request: ReportSubmitRequest): Promise<ReportVO> {
    return this.client.post<ReportVO>(appApiPath('/feedback/reports'), request);
  }

  async listReports(query: ReportQuery): Promise<ReportVO[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      page: query.page,
      size: query.size,
    };
    const result = await this.client.get<PageResult<ReportVO>>(appApiPath('/feedback/reports'), params);
    return result.content;
  }

  async getReportById(reportId: string): Promise<ReportDetailVO> {
    return this.client.get<ReportDetailVO>(appApiPath(`/feedback/reports/${reportId}`));
  }

  async listFaqCategories(): Promise<FaqCategoryVO[]> {
    return this.client.get<FaqCategoryVO[]>(appApiPath('/feedback/faq/categories'));
  }

  async listFaqs(query: FaqQuery): Promise<FaqVO[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      categoryId: query.categoryId,
      page: query.page,
      size: query.size,
    };
    const result = await this.client.get<PageResult<FaqVO>>(appApiPath('/feedback/faq'), params);
    return result.content;
  }

  async searchFaqs(keyword: string): Promise<FaqVO[]> {
    return this.client.get<FaqVO[]>(appApiPath('/feedback/faq/search'), { keyword });
  }

  async getFaqById(faqId: string): Promise<FaqDetailVO> {
    return this.client.get<FaqDetailVO>(appApiPath(`/feedback/faq/${faqId}`));
  }

  async likeFaq(faqId: string): Promise<void> {
    await this.client.post(appApiPath(`/feedback/faq/${faqId}/like`));
  }

  async dislikeFaq(faqId: string): Promise<void> {
    await this.client.post(appApiPath(`/feedback/faq/${faqId}/dislike`));
  }

  async listTutorials(query: TutorialQuery): Promise<TutorialVO[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      page: query.page,
      size: query.size,
    };
    const result = await this.client.get<PageResult<TutorialVO>>(appApiPath('/feedback/tutorials'), params);
    return result.content;
  }

  async getTutorialById(tutorialId: string): Promise<TutorialDetailVO> {
    return this.client.get<TutorialDetailVO>(appApiPath(`/feedback/tutorials/${tutorialId}`));
  }

  async getOnboardingGuide(): Promise<OnboardingStepVO[]> {
    return this.client.get<OnboardingStepVO[]>(appApiPath('/feedback/onboarding'));
  }

  async completeOnboardingStep(stepId: string): Promise<void> {
    await this.client.post(appApiPath(`/feedback/onboarding/${stepId}/complete`));
  }

  async getSupportInfo(): Promise<SupportInfoVO> {
    return this.client.get<SupportInfoVO>(appApiPath('/feedback/support'));
  }

  async sendSupportMessage(request: SupportMessageRequest): Promise<SupportMessageVO> {
    return this.client.post<SupportMessageVO>(appApiPath('/feedback/support/messages'), request);
  }

  async listSupportMessages(query: SupportMessageQuery): Promise<SupportMessageVO[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      page: query.page,
      size: query.size,
    };
    const result = await this.client.get<PageResult<SupportMessageVO>>(appApiPath('/feedback/support/messages'), params);
    return result.content;
  }
}

export function createFeedbackApi(client: HttpClient): FeedbackModule {
  return new FeedbackApi(client);
}
