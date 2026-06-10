'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createReviewRequest, ActionResult } from '@/app/actions/requests';

const initialState: ActionResult = { success: false };

export default function RequestForm() {
  const [state, formAction, isPending] = useActionState(
    createReviewRequest,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form on success
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">
        New Review Request
      </h2>
      <p className="text-sm text-slate-500 mb-5">
        Add a client review request. ASIN must be exactly 10 characters.
      </p>

      {/* Success banner */}
      {state.success && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Review request created successfully!
        </div>
      )}

      {/* Error banner (non-field errors, e.g. duplicate) */}
      {!state.success && state.error && (
        <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {state.error}
        </div>
      )}

      <form ref={formRef} action={formAction} className="grid sm:grid-cols-3 gap-4">
        {/* Client Name */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="client_name"
            className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
          >
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            id="client_name"
            name="client_name"
            type="text"
            placeholder="Acme Corp"
            autoComplete="off"
            className={`w-full border rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-indigo-400 transition
              ${state.fieldErrors?.client_name ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'}`}
          />
          {state.fieldErrors?.client_name && (
            <p className="text-xs text-red-600">{state.fieldErrors.client_name}</p>
          )}
        </div>

        {/* Product ASIN */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="product_asin"
            className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
          >
            Product ASIN <span className="text-red-500">*</span>
          </label>
          <input
            id="product_asin"
            name="product_asin"
            type="text"
            placeholder="B08N5WRWNW"
            autoComplete="off"
            maxLength={10}
            className={`w-full border rounded-lg px-3 py-2 text-sm font-mono text-slate-800 placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-indigo-400 transition
              ${state.fieldErrors?.product_asin ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'}`}
          />
          {state.fieldErrors?.product_asin && (
            <p className="text-xs text-red-600">{state.fieldErrors.product_asin}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex flex-col justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 
              text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            {isPending ? 'Adding…' : 'Add Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
