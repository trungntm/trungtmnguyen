'use client';

import { Button, Dialog, Textarea } from '@trungtmnguyen/ui';
import { useId, useState, type SyntheticEvent } from 'react';

import { useReportComment } from '../hooks/use-report-comment';
import { useCommentContext } from '../providers/comment-provider';
import { COMMENT_REPORT_REASONS, type CommentReportReason } from '../types';

type CommentReportDialogProps = {
  commentId: string;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  open: boolean;
};

export function CommentReportDialog({
  commentId,
  onOpenChange,
  onSuccess,
  open,
}: CommentReportDialogProps) {
  const { messages } = useCommentContext();
  const { error, isSubmitting, submit } = useReportComment();
  const [reason, setReason] = useState<CommentReportReason | null>(null);
  const [details, setDetails] = useState('');
  const [reasonError, setReasonError] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reason) {
      setReasonError(true);
      return;
    }
    const succeeded = await submit(commentId, {
      reason,
      ...(reason === 'OTHER' ? { details } : {}),
    });
    if (!succeeded) return;
    setReason(null);
    setDetails('');
    setReasonError(false);
    onOpenChange(false);
    onSuccess();
  }

  return (
    <Dialog
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      onOpenChange={onOpenChange}
      open={open}
    >
      <form className="space-y-5 p-5 sm:p-6" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <h3 className="text-xl font-semibold" id={titleId}>
            {messages.reportTitle}
          </h3>
          <p className="text-sm leading-6 text-muted" id={descriptionId}>
            {messages.reportDescription}
          </p>
        </div>

        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm font-medium">{messages.reportReasonLabel}</legend>
          {COMMENT_REPORT_REASONS.map((value) => (
            <label
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-sm focus-within:ring-2 focus-within:ring-primary/30"
              key={value}
            >
              <input
                checked={reason === value}
                disabled={isSubmitting}
                name={`report-reason-${commentId}`}
                onChange={() => {
                  setReason(value);
                  setReasonError(false);
                }}
                type="radio"
                value={value}
              />
              {messages.reportReasons[value]}
            </label>
          ))}
        </fieldset>
        {reasonError ? (
          <p className="text-sm text-red-600" role="alert">
            {messages.reportReasonRequired}
          </p>
        ) : null}

        {reason === 'OTHER' ? (
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor={`report-details-${commentId}`}>
              {messages.reportDetailsLabel}
            </label>
            <Textarea
              disabled={isSubmitting}
              id={`report-details-${commentId}`}
              maxLength={500}
              onChange={(event) => setDetails(event.target.value)}
              placeholder={messages.reportDetailsPlaceholder}
              rows={4}
              value={details}
            />
          </div>
        ) : null}

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap justify-end gap-2">
          <Button
            aria-label={messages.closeDialog}
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
            variant="ghost"
          >
            {messages.reportCancel}
          </Button>
          <Button disabled={isSubmitting} type="submit" variant="danger">
            {isSubmitting ? messages.reportSubmitting : messages.reportSubmit}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
