import TrackerHistory from "@/app/components/TrackerHistory";

export default function History() {

  return (
    <div className="flex justify-center w-full text-black mt-[190px]">
      <div className="max-w-[1170px] w-full">

        <div className="flex items-center mb-[53px]">
          <h2 className="text-2xl text-ebony font-bold">Trackers History</h2>
        </div>

        <TrackerHistory />
      </div>
    </div>
  )
}
