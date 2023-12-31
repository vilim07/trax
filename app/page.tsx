import Image from "next/image";

import TrackerTable from '@/app/components/TrackerTable';

export default function Home() {

  const currentDate = new Date();
  const date = currentDate.toLocaleDateString('en-GB').replace(/\//g, '.') + ".";

  return (
    <div className="flex justify-center w-full text-black mt-[190px]">
      <div className="max-w-[1170px] w-full">

        <div className="flex items-center mb-[82px]">
          <Image
            src="/icons/calendar.svg"
            width="25"
            height="25"
            alt="calendar icon"
            className='mr-[16px]'            
          />
          <h2 className="text-2xl text-ebony font-bold">Today ({date})</h2>
        </div>

        <TrackerTable />
      </div>
    </div>
  )
}


//MESSAGE

/* 
If there was a need to use username for login then there would be a new field for it during registration.
Then there would be a collection created that pairs usernames with emails.
During login there would be a query for that username and then the returned email if found would be used for sign in.

The "text search" for the filter is something I made on my final paper which could also be found under my git ('zavrsni').
Its more of a workaround to not use algolia.

I opted to use snapshots for everything to avoid syncing with the server.

Wanted to add skeletons, loading and mobile design but ran out of time.
*/