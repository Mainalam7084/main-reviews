'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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

            if (!res.ok) {
                throw new Error('Failed to update profile');
            }

            toast.success('Profile updated successfully');
            router.refresh();
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    const onDeleteAccount = async () => {
        if (deleteConfirmation !== 'DELETE') return;

        setIsDeleting(true);
        try {
            const res = await fetch('/api/account', {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Failed to delete account');
            }

            toast.success('Account deleted successfully');
            // Force sign out and redirect happens via next-auth or manual reload
            // Ideally redirect to home, and next-auth session check will handle the rest
            // or manually sign out client side? api/account handles deletion in DB.
            // We should probably sign out client side too.
            // But for now, let's redirect to home which will likely refresh.
            window.location.href = '/';
        } catch (error) {
            toast.error('Failed to delete account. Please try again.');
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Profile Settings */}
            <Card className="border-zinc-800 bg-zinc-900 text-white">
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Update your public profile information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                value={user.email || ''}
                                disabled
                                className="bg-zinc-950 border-zinc-700 text-gray-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500">Email cannot be changed.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Display Name</Label>
                            <Input
                                id="name"
                                {...form.register('name')}
                                className="bg-zinc-950 border-zinc-700 focus:border-red-600"
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isUpdating}
                            className="bg-white text-black hover:bg-gray-200 font-medium"
                        >
                            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-900/50 bg-red-950/10 text-white">
                <CardHeader>
                    <CardTitle className="text-red-500 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription className="text-red-200/70">
                        Irreversible actions. Proceed with caution.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm text-gray-400">
                                Permanently delete your account and all associated reviews.
                            </p>
                        </div>
                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Account
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                        This action cannot be undone. This will permanently delete your
                                        account and remove your data from our servers.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4 space-y-4">
                                    <Label htmlFor="confirm-delete">
                                        Type <span className="font-bold text-red-500">DELETE</span> to confirm
                                    </Label>
                                    <Input
                                        id="confirm-delete"
                                        value={deleteConfirmation}
                                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                                        className="bg-zinc-950 border-zinc-700"
                                        placeholder="DELETE"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDeleteDialogOpen(false)}
                                        className="border-zinc-700 hover:bg-zinc-800 text-white hover:text-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={onDeleteAccount}
                                        disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Delete Account
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
