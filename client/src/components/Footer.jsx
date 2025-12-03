

export default function Footer (){
    return (
       <footer className='fixed bottom-0 w-full bg-white border-t border-gray-200 left-0 p-4'>
            <div>
                VOUTS&copy;{new Date().getFullYear()}
            </div>
       </footer>
    )
}