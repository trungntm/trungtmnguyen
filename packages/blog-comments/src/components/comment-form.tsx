'use client';

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { Button, Input, Textarea } from '@trungtmnguyen/ui';
import { LoaderCircle, Send } from 'lucide-react';
import { useRef, useState, type SyntheticEvent } from 'react';

import { useCreateComment } from '../hooks/use-create-comment';
import { useCommentContext } from '../providers/comment-provider';
import { formatCommentMessage } from '../utils/messages';

type CommentFormProps = {
  onCancel?: () => void;
  onSubmitted?: () => void;
  parentId?: string;
  postId: string;
  replyToName?: string;
};

export function CommentForm({
  onCancel,
  onSubmitted,
  parentId,
  postId,
  replyToName,
}: CommentFormProps) {
  const { locale, messages, onCommentSubmitted, turnstileSiteKey } = useCommentContext();
  const { error, fieldErrors, isSubmitting, submit } = useCreateComment();
  const [displayName, setDisplayName] = useState('');
  const [content, setContent] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);

  function resetTurnstile() {
    setToken(null);
    turnstileRef.current?.reset();
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(false);
    const succeeded = await submit({
      postId,
      ...(parentId ? { parentId } : {}),
      displayName,
      content,
      turnstileToken: token ?? '',
    });
    resetTurnstile();
    if (!succeeded) return;

    setContent('');
    setSubmitted(true);
    onCommentSubmitted?.(parentId ? 'reply' : 'comment');
    onSubmitted?.();
  }

  const contentErrorId = fieldErrors.content ? `${parentId ?? 'root'}-comment-error` : undefined;
  const nameErrorId = fieldErrors.displayName ? `${parentId ?? 'root'}-name-error` : undefined;
  const isReply = Boolean(parentId);

  return (
    <form className={isReply ? 'space-y-3' : 'space-y-4'} noValidate onSubmit={handleSubmit}>
      {replyToName ? (
        <p className="text-sm font-medium text-muted">
          {formatCommentMessage(messages.replyTo, { name: replyToName })}
        </p>
      ) : null}

      <div
        className={`rounded-2xl border border-border bg-background transition-shadow focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 ${
          isReply ? 'p-3' : 'p-4 sm:p-5'
        }`}
      >
        <div>
          <label className="sr-only" htmlFor={`${parentId ?? 'root'}-display-name`}>
            {messages.displayNameLabel}
          </label>
          <Input
            aria-describedby={nameErrorId}
            aria-invalid={Boolean(fieldErrors.displayName)}
            autoComplete="name"
            className="h-10 bg-surface/60"
            disabled={isSubmitting}
            id={`${parentId ?? 'root'}-display-name`}
            maxLength={40}
            minLength={2}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder={messages.displayNameLabel}
            value={displayName}
          />
        </div>

        <label className="sr-only" htmlFor={`${parentId ?? 'root'}-comment`}>
          {messages.commentLabel}
        </label>
        <Textarea
          aria-describedby={contentErrorId}
          aria-invalid={Boolean(fieldErrors.content)}
          className={`mt-3 resize-y bg-surface/60 ${isReply ? 'min-h-24' : 'min-h-36'}`}
          disabled={isSubmitting}
          id={`${parentId ?? 'root'}-comment`}
          maxLength={2000}
          minLength={2}
          onChange={(event) => setContent(event.target.value)}
          placeholder={messages.commentPlaceholder}
          rows={replyToName ? 3 : 5}
          value={content}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex min-w-0 items-center gap-3">
            {isReply && onCancel ? (
              <Button
                className="h-9 px-3 text-muted hover:text-foreground"
                disabled={isSubmitting}
                onClick={onCancel}
                size="sm"
                variant="ghost"
              >
                {messages.cancelReply}
              </Button>
            ) : null}
            <span className="text-xs text-muted">
              {formatCommentMessage(messages.characterCount, { count: content.length, max: 2000 })}
            </span>
          </div>
          <Button
            aria-label={isSubmitting ? messages.submitting : messages.submit}
            className="size-10 shrink-0"
            disabled={isSubmitting || !turnstileSiteKey}
            size="icon"
            title={isSubmitting ? messages.submitting : messages.submit}
            type="submit"
          >
            {isSubmitting ? (
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Send aria-hidden="true" className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {fieldErrors.displayName ? (
        <p className="text-sm text-red-600" id={nameErrorId} role="alert">
          {fieldErrors.displayName}
        </p>
      ) : null}
      {fieldErrors.content ? (
        <p className="text-sm text-red-600" id={contentErrorId} role="alert">
          {fieldErrors.content}
        </p>
      ) : null}

      <div className="min-h-16 overflow-x-auto">
        {turnstileSiteKey ? (
          <Turnstile
            ref={turnstileRef}
            onError={() => {
              setTurnstileFailed(true);
              resetTurnstile();
            }}
            onExpire={resetTurnstile}
            onSuccess={(nextToken) => {
              setTurnstileFailed(false);
              setToken(nextToken);
            }}
            options={{ language: locale }}
            siteKey={turnstileSiteKey}
          />
        ) : (
          <p className="text-sm text-red-600" role="alert">
            {messages.turnstileError}
          </p>
        )}
        {fieldErrors.turnstile ? (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {fieldErrors.turnstile}
          </p>
        ) : null}
        {turnstileFailed ? (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {messages.turnstileError}
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {submitted ? (
        <p className="text-sm font-medium text-emerald-600" role="status">
          {messages.pendingApproval}
        </p>
      ) : null}
    </form>
  );
}
