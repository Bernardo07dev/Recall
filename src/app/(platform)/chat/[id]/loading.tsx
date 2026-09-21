export default function Loading() {
    return (
        <div className="py-22 px-6 min-h-screen flex flex-col justify-end items-center">
            <section className="mb-24 fade-in my-4 w-full max-w-[830px] flex flex-col gap-6 opacity-70">
                
                {/* AI Message Skeleton */}
                <div className="flex items-center justify-start w-full">
                    <div className="flex flex-col gap-3.5 px-4 py-2 w-full max-w-[80%]">
                        <div className="h-3 w-[90%] bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                        <div className="h-3 w-[75%] bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                        <div className="h-3 w-[40%] bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>

                {/* Human Message Skeleton */}
                <div className="flex items-center justify-end w-full mt-4">
                    <div className="bg-[#F2F3FB] p-5 rounded-2xl flex flex-col gap-3 items-end w-fit max-w-[80%]">
                        <div className="h-3 w-48 bg-gray-300/60 rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
                        <div className="h-3 w-32 bg-gray-300/60 rounded-full animate-pulse" style={{ animationDelay: '600ms' }} />
                    </div>
                </div>

                 {/* Tool/Thinking AI Message Skeleton */}
                 <div className="flex items-center justify-start w-full mt-2">
                    <div className="flex flex-col gap-3 px-4 py-2 w-full max-w-[80%]">
                        <div className="h-[52px] w-[260px] bg-gray-50 border border-gray-200/60 rounded-xl animate-pulse flex items-center px-4 gap-3">
                             <div className="w-6 h-6 rounded-md bg-gray-200/80 animate-pulse"></div>
                             <div className="h-2.5 w-24 bg-gray-200/80 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* AI Message Skeleton (Short) */}
                <div className="flex items-center justify-start w-full mt-1">
                    <div className="flex flex-col gap-3.5 px-4 py-2 w-full max-w-[80%]">
                        <div className="h-3 w-[85%] bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: '750ms' }} />
                        <div className="h-3 w-[60%] bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: '900ms' }} />
                    </div>
                </div>

            </section>

            <div className="w-full max-w-[830px] fixed bottom-0">
                <div className="w-full relative flex flex-col text-sm bg-white rounded-3xl p-3 border border-[#544a972b] animate-pulse">
                     <div className="w-full pb-3 flex flex-row items-center">
                         <div className="p-2 ml-1 text-gray-300 flex items-center justify-center">
                             <div className="w-[15px] h-[15px] rounded-sm bg-gray-200"></div>
                         </div>
                         <div className="p-2 w-full">
                             <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
                         </div>
                         <div className="p-3 w-[39px] h-[39px] rounded-full bg-gray-100 flex items-center justify-center">
                              <div className="w-[15px] h-[15px] rounded-sm bg-gray-200"></div>
                         </div>
                     </div>
                     <div className="flex items-center gap-1.5 ml-2 pb-1.5 pt-1">
                          <div className="w-[14px] h-[14px] rounded-full bg-gray-200"></div>
                          <div className="h-3.5 w-24 bg-gray-200 rounded-md"></div>
                     </div>
                </div>
                <div className='bg-[#FBFBFF] backdrop-blur-sm w-full h-8 z-999 '></div>
            </div>
        </div>
    );
}
