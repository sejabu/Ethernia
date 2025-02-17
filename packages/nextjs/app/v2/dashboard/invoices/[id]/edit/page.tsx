import Form from '~~/app/v2/ui/invoices/edit-form';
import Breadcrumbs from '~~/app/v2/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '~~/app/v2/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Edit Invoice',
};

 
export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
    ]);

    if (!invoice) {
        notFound();
      }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/v2/dashboard/invoices' },
                    {
                    label: 'Edit Invoice',
                    href: `/v2/dashboard/invoices/${id}/edit`,
                    active: true,
                    },
                ]}
            />
            <Form invoice={invoice} customers={customers} />
        </main>
    );
}