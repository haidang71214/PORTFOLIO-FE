"use client";

import React, { useState, useEffect } from "react";
import { useGetOwnedTemplatesQuery } from "@/store/queries/templates";

import { CountdownTimer } from "@/components/common/CountdownTimer";

export default function OwnedTemplatesPage() {
  const { data: templates = [], isLoading, isError } = useGetOwnedTemplatesQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load owned templates. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">My Templates</h1>
          <p className="mt-2 text-sm text-gray-600">View and manage the portfolio templates you own.</p>
        </div>

        {templates.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
            <p className="mt-1 text-sm text-gray-500">You haven't purchased or been granted any templates yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tpl) => {
              const imageUrl = Array.isArray(tpl.preview_images) && tpl.preview_images.length > 0
                ? tpl.preview_images[0]
                : "https://via.placeholder.com/600x400?text=No+Image";

              return (
                <div key={tpl.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 flex flex-col">
                  <div className="relative h-48 w-full bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={tpl.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 truncate">{tpl.name}</h3>
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {tpl.target_major.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
                      {tpl.description || "No description provided."}
                    </p>
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 mb-1">Time Remaining</span>
                        <CountdownTimer expiresAt={tpl.expires_at} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
