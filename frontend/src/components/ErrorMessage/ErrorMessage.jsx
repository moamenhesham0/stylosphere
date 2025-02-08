import React ,{ useState , useEffect} from "react";



export const ErrorMessage = ({message}) => {
    if(!message) return (<></>);
    const [shake , setShake] = useState(false);
    
    useEffect(() => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    }, []);
    // Define the shake keyframes CSS
    const shakeKeyframes = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
      }
    `;
    const fadeKeyframes = `
      @keyframes fade {
        0% { opacity: 1; }
        70% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    return (
      <>
        {shake ? (<style>{shakeKeyframes}</style>):(<></>) }
        <style>{fadeKeyframes}</style>
        <div className="error-message" 
             style={{
               color: '#ff3333',
               fontSize: '0.875rem',
               marginTop: '8px',
               padding: '8px 12px',
               backgroundColor: '#fff0f0',
               borderRadius: '6px',
               border: '1px solid #ffcccc',
               boxShadow: '0 2px 4px rgba(255, 0, 0, 0.1)',
               display: 'flex',
               alignItems: 'center',
               gap: '8px',
               animation: `${shake ? 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97),' : ''} fade 3s forwards`
             }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 15A7 7 0 108 1a7 7 0 000 14zM7 4h2v5H7V4zm0 6h2v2H7v-2z" 
                  fill="#ff3333"/>
          </svg>
          {message}
        </div>
      </>
    );
  };