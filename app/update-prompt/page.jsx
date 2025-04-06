'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Form from '@components/Form';

const EditPrompt = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const promptId = searchParams?.get('id'); // Ensure searchParams is defined

    const [submitting, setSubmitting] = useState(false);
    const [post, setPost] = useState({
        prompt: '',
        tag: '',
    });

    useEffect(() => {
        const getPromptDetails = async () => {
            if (!promptId) return;

            try {
                const response = await fetch(`/api/prompt/${promptId}`);
                if (!response.ok) throw new Error('Failed to fetch prompt details');

                const data = await response.json();
                setPost({
                    prompt: data.prompt,
                    tag: data.tag,
                });
            } catch (error) {
                console.error(error);
            }
        };

        getPromptDetails();
    }, [promptId]);

    const updatePrompt = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        if (!promptId) {
            alert('Prompt ID not found');
            setSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`/api/prompt/${promptId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: post.prompt,
                    tag: post.tag,
                }),
            });

            if (response.ok) {
                router.push('/');
            } else {
                throw new Error('Failed to update prompt');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Form
            type="Edit"
            post={post}
            setPost={setPost}
            submitting={submitting}
            handleSubmit={updatePrompt}
        />
    );
};

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditPrompt />
        </Suspense>
    );
}
