'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

import { BrutalButton } from '@/components/ui/brutal-button';
import { BrutalCardStatic } from '@/components/ui/brutal-card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface AccountFormProps {
    user: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
}

export function AccountForm({ user }: AccountFormProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name || '',
        },
    });

    const onSubmit = async (data: ProfileFormValues) => {
        setIsUpdating(true);
        try {
            const res = await fetch('/api/account', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to update profile');

            toast.success('Profile updated successfully', {
                style: { border: '3px solid #0A0A0A', borderRadius: '0', boxShadow: '4px 4px 0px 0px #0A0A0A', background: '#00F5A0', color: '#0A0A0A', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 'bold' }
            });
            router.refresh();
        } catch (error) {
            toast.error('Something went wrong. Please try again.', {
                style: { border: '3px solid #0A0A0A', borderRadius: '0', boxShadow: '4px 4px 0px 0px #0A0A0A', background: '#E60000', color: '#FFFFFF', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 'bold' }
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const onDeleteAccount = async () => {
        if (deleteConfirmation !== 'DELETE') return;

        setIsDeleting(true);
        try {
            const res = await fetch('/api/account', { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete account');

            toast.success('Account deleted successfully');
            window.location.href = '/';
        } catch (error) {
            toast.error('Failed to delete account. Please try again.');
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-12">
            {/* Profile Settings */}
            <BrutalCardStatic className="p-8 md:p-10 relative">
                <div className="absolute -top-4 -left-4 bg-[#FFE500] border-3 border-border px-4 py-1 font-display font-800 uppercase tracking-widest shadow-[4px_4px_0px_0px_var(--border)] -rotate-2">
                    Profile Info
                </div>
                
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-display font-800 uppercase tracking-widest text-foreground">
                            Email
                        </label>
                        <input
                            id="email"
                            value={user.email || ''}
                            disabled
                            className="brutal-input block w-full p-4 text-base bg-muted text-muted-foreground cursor-not-allowed shadow-none border-dashed"
                        />
                        <p className="text-xs font-sans font-600 text-muted-foreground">Email cannot be changed.</p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-display font-800 uppercase tracking-widest text-foreground">
                            Display Name
                        </label>
                        <input
                            id="name"
                            {...form.register('name')}
                            className="brutal-input block w-full p-4 text-base focus:shadow-[4px_4px_0px_0px_var(--primary)]"
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm font-display font-700 text-[#E60000]">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="pt-4">
                        <BrutalButton type="submit" isLoading={isUpdating} variant="primary" size="lg">
                            Save Changes
                        </BrutalButton>
                    </div>
                </form>
            </BrutalCardStatic>

            {/* Danger Zone */}
            <BrutalCardStatic className="p-8 md:p-10 border-[#FF0000] shadow-[6px_6px_0px_0px_#FF0000] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#FF0000] strip-pattern" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #FF0000, #FF0000 10px, transparent 10px, transparent 20px)' }} />
                
                <div className="flex items-start justify-between flex-col md:flex-row gap-6 mt-4">
                    <div>
                        <h3 className="font-display font-800 text-2xl uppercase tracking-tighter text-[#FF0000] flex items-center gap-2">
                            <AlertTriangle className="h-6 w-6 stroke-[3]" /> Danger Zone
                        </h3>
                        <p className="text-foreground font-sans font-600 mt-2">
                            Permanently delete your account and all associated reviews. Irreversible action.
                        </p>
                    </div>
                    
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogTrigger asChild>
                            <BrutalButton variant="danger" size="md">
                                Delete Account
                            </BrutalButton>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] border-3 border-[#FF0000] shadow-[8px_8px_0px_0px_#FF0000] rounded-none bg-card">
                            <DialogHeader>
                                <DialogTitle className="font-display font-800 text-3xl uppercase tracking-tighter text-[#FF0000]">Are you sure?</DialogTitle>
                                <DialogDescription className="font-sans text-sm font-600 text-foreground">
                                    This action cannot be undone. This will permanently delete your account and wipe your data from our servers.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-6 space-y-4">
                                <label htmlFor="confirm-delete" className="block text-sm font-display font-800 uppercase tracking-widest text-foreground">
                                    Type <span className="text-[#FF0000] bg-[#FF0000]/10 px-1 border border-[#FF0000]">DELETE</span> to confirm
                                </label>
                                <input
                                    id="confirm-delete"
                                    value={deleteConfirmation}
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                    className="brutal-input block w-full p-4 text-base focus:shadow-[4px_4px_0px_0px_#FF0000] border-[#FF0000]"
                                    placeholder="DELETE"
                                />
                            </div>
                            <DialogFooter className="flex-col sm:flex-row gap-3">
                                <BrutalButton variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="w-full sm:w-auto border-muted-foreground text-muted-foreground hover:border-foreground hover:text-foreground">
                                    Cancel
                                </BrutalButton>
                                <BrutalButton
                                    variant="danger"
                                    onClick={onDeleteAccount}
                                    disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                                    isLoading={isDeleting}
                                    className="w-full sm:w-auto"
                                >
                                    Confirm Deletion
                                </BrutalButton>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </BrutalCardStatic>
        </div>
    );
}
