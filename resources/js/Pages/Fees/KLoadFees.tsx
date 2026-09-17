import AppLayout from '@/Layouts/AppLayout';
import { KLoadFee, KLoadFeePageProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function KLoadFees({ fees }: KLoadFeePageProps) {

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        fee: '',
    });
    
    function submit(e: FormEvent) {
        e.preventDefault();
        post('/fee/kload', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    function destroy(fee: KLoadFee) {
        console.log(fee.id);
        if (confirm('Remove this fee ?')) {
            router.delete(`/fee/kload/${fee.id}`, { preserveScroll: true });
       }
    }

    return (
        <AppLayout>
            <Head title="K Load Fee" />
            <div className="mb-6">
                <h1 className="font-display text-2xl font-bold md:text-3xl">Kuryente Load Fee</h1>
                <p className="text-sm text-clay-textSoft">
                    Configure how much profit (fee) is earned per transaction amount range. New transactions use these fees automatically.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="clay overflow-hidden p-2">
                    <table className="w-full border-separate border-spacing-y-1 text-sm">
                        <thead>
                        <tr className="text-left text-xs font-bold uppercase text-clay-textSoft">
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Fee</th>
                            <th className="px-4 py-2 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fees.map((fee) => (
                            <tr key={fee.id} className="clay-sm">
                                <td className="px-4 py-3 font-semibold">
                                    ₱{fee.amount.toLocaleString()} 
                                </td>
                                <td className="px-4 py-3">
                                    <span className="clay-chip bg-clay-successSoft px-3 py-1 text-xs font-bold text-clay-success">
                                    ₱{parseFloat(fee.fee).toFixed(2)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => destroy(fee)} className="clay-sm px-3 py-1.5 text-xs font-bold text-clay-danger">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {fees.length === 0 && (
                            <tr>
                            <td colSpan={3} className="px-4 py-10 text-center text-clay-textFaint">
                                No fee fees configured yet — add one to start calculating fees.
                            </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                </div>

                <div>
                    <form onSubmit={submit} className="clay flex flex-col gap-4 p-6">
                        <h3 className="font-display text-lg font-bold">Add a fee</h3>


                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase text-clay-textSoft">Amount (₱)</label>
                            <input
                                type="number"
                                min="100"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                placeholder="e.g. 100"
                                className="clay-inset w-full border-0 bg-transparent px-4 py-2.5 text-sm font-semibold outline-none placeholder:text-clay-textFaint"
                            />
                            {errors.amount && <p className="mt-1 text-xs font-medium text-clay-danger">{errors.amount}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase text-clay-textSoft">Fee (₱)</label>
                            <input
                                type="number"
                                min="1"
                                step="0.01"
                                value={data.fee}
                                onChange={(e) => setData('fee', e.target.value)}
                                placeholder="e.g. 15"
                                className="clay-inset w-full border-0 bg-transparent px-4 py-2.5 text-sm font-semibold outline-none"
                            />
                            {errors.fee && <p className="mt-1 text-xs font-medium text-clay-danger">{errors.fee}</p>}
                        </div>

                        <button type="submit" disabled={processing} className="clay-btn mt-1 bg-clay-primary py-3 text-sm font-bold text-white">
                            {processing ? 'Adding…' : 'Add Fee'}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}