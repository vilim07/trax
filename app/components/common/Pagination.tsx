import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import Image from "next/image";

export default function Pagination({ page, count, pageSize, onChange }: { page: number; count: number; pageSize: number; onChange: (event: PaginatorPageChangeEvent) => void }) {

    return (
        <Paginator first={page * pageSize} totalRecords={count} rows={pageSize} onPageChange={onChange}
            template={{
                layout: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
                'PrevPageLink': (options) => {
                    return (
                        <button type="button" className={`p-paginator-prev p-paginator-element p-link ${options.disabled ? 'p-disabled' : ''}`} onClick={options.onClick}>
                            <span className="p-paginator-icon"> <Image src="/icons/pi-caret-left.svg" width="9" height="14" alt="chevron left icon" /> </span>
                        </button>
                    );
                },
                'FirstPageLink': (options) => {
                    return (
                        <button type="button" className={`p-paginator-first p-paginator-element p-link ${options.disabled ? 'p-disabled' : ''}`} onClick={options.onClick}>
                            <span className="p-paginator-icon"> <Image src="/icons/pi-step-backward.svg" width="9" height="14" alt="chevron first icon" /> </span>
                        </button>
                    );
                },
                'NextPageLink': (options) => {
                    return (
                        <button type="button" className={`p-paginator-next p-paginator-element p-link ${options.disabled ? 'p-disabled' : ''}`} onClick={options.onClick}>
                            <span className="p-paginator-icon rotate-180"> <Image src="/icons/pi-caret-left.svg" width="9" height="14" alt="chevron right icon" /> </span>
                        </button>
                    );
                },
                'LastPageLink': (options) => {
                    return (
                        <button type="button" className={`p-paginator-last p-paginator-element p-link ${options.disabled ? 'p-disabled' : ''}`} onClick={options.onClick}>
                            <span className="p-paginator-icon rotate-180"> <Image src="/icons/pi-step-backward.svg" width="9" height="14" alt="chevron last icon" /> </span>
                        </button>
                    );
                }
            }}
            pt={{
                pageButton: () => ({
                    className: 'bg-red'
                })
            }
            }
        />
    )

}
