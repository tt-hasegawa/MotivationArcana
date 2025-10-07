import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [currentCard, setCurrentCard] = useState<string>('')

  const motivationCards = [
    '自己実現の欲求',
    '承認欲求',
    '所属の欲求',
    '安全の欲求',
    '生理的欲求',
    '成長欲求',
    '貢献欲求',
    '自律性欲求'
  ]

  const drawCard = () => {
    const randomCard = motivationCards[Math.floor(Math.random() * motivationCards.length)]
    setCurrentCard(randomCard)
  }

  return (
    <>
      <Head>
        <title>モチベーションアルカナ - あなたの心の源泉を探る</title>
        <meta name="description" content="モチベーションの源泉を探る心理ゲーム" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{
        minHeight: '100vh',
        padding: '0 2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <h1 style={{ 
            color: '#333', 
            marginBottom: '1rem',
            fontSize: '2.5rem'
          }}>
            モチベーションアルカナ
          </h1>
          <p style={{ 
            color: '#666', 
            marginBottom: '2rem',
            fontSize: '1.1rem'
          }}>
            あなたの心の奥にある動機の源泉を発見しましょう
          </p>
          
          <div style={{
            minHeight: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            border: '2px solid #e9ecef'
          }}>
            {currentCard ? (
              <div style={{
                padding: '1rem',
                backgroundColor: '#667eea',
                color: 'white',
                borderRadius: '10px',
                fontSize: '1.3rem',
                fontWeight: 'bold'
              }}>
                {currentCard}
              </div>
            ) : (
              <p style={{ color: '#adb5bd', fontSize: '1rem' }}>
                カードをドローして、あなたの今のモチベーションを探ってみましょう
              </p>
            )}
          </div>

          <button
            onClick={drawCard}
            style={{
              backgroundColor: '#764ba2',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(118, 75, 162, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(118, 75, 162, 0.4)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(118, 75, 162, 0.3)'
            }}
          >
            カードをドロー
          </button>
        </div>
      </main>
    </>
  )
}