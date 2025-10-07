import Head from 'next/head'
import { useState, useCallback, useEffect } from 'react'
import { ArcanaCard, GameScreen } from '../types/arcana'
import { arcanaCards } from '../data/arcanaCards'
import QRCode from 'qrcode'

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>(GameScreen.TITLE)
  const [usedCardIndices, setUsedCardIndices] = useState<Set<number>>(new Set())
  const [selectedCards, setSelectedCards] = useState<ArcanaCard[]>([])
  const [currentPair, setCurrentPair] = useState<ArcanaCard[]>([])
  const [roundCount, setRoundCount] = useState<number>(0)
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('')

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const appURL = 'https://tt-hasegawa.github.io/MotivationArcana/'
        const qrCodeURL = await QRCode.toDataURL(appURL, {
          width: 150,
          margin: 1,
          color: {
            dark: '#333333',
            light: '#FFFFFF'
          }
        })
        setQrCodeDataURL(qrCodeURL)
      } catch (error) {
        console.error('QRコードの生成に失敗しました:', error)
      }
    }
    
    generateQRCode()
  }, [])

  const getRandomUnusedCards = useCallback((count: number): ArcanaCard[] => {
    const availableIndices = arcanaCards
      .map((_, index) => index)
      .filter(index => !usedCardIndices.has(index))
    
    const selectedIndices: number[] = []
    while (selectedIndices.length < count && selectedIndices.length < availableIndices.length) {
      const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
      if (!selectedIndices.includes(randomIndex)) {
        selectedIndices.push(randomIndex)
      }
    }
    
    return selectedIndices.map(index => arcanaCards[index])
  }, [usedCardIndices])

  const startGame = () => {
    setUsedCardIndices(new Set())
    setSelectedCards([])
    setRoundCount(0)
    const initialPair = getRandomUnusedCards(2)
    setCurrentPair(initialPair)
    setCurrentScreen(GameScreen.SELECTION)
  }

  const selectCard = (card: ArcanaCard) => {
    const newSelectedCards = [...selectedCards, card]
    setSelectedCards(newSelectedCards)
    
    const newUsedIndices = new Set(usedCardIndices)
    currentPair.forEach(pairCard => {
      const index = arcanaCards.findIndex(c => c.no === pairCard.no)
      newUsedIndices.add(index)
    })
    setUsedCardIndices(newUsedIndices)
    
    const newRoundCount = roundCount + 1
    setRoundCount(newRoundCount)
    
    if (newRoundCount >= 5) {
      setCurrentScreen(GameScreen.RESULT)
    } else {
      const nextPair = getRandomUnusedCards(2)
      setCurrentPair(nextPair)
    }
  }

  const resetGame = () => {
    setCurrentScreen(GameScreen.TITLE)
    setUsedCardIndices(new Set())
    setSelectedCards([])
    setCurrentPair([])
    setRoundCount(0)
  }

  const renderTitleScreen = () => (
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
      <p style={{ 
        color: '#666', 
        marginBottom: '2rem',
        fontSize: '1rem'
      }}>
        アルカナカードから5回選択して、あなたの内発的・外発的動機を測定します
      </p>
      
      {qrCodeDataURL && (
        <div style={{ 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#666',
            fontSize: '0.9rem',
            marginBottom: '0.5rem'
          }}>
            このアプリのURL
          </p>
          <img 
            src={qrCodeDataURL} 
            alt="アプリURL QRコード" 
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <p style={{
            color: '#888',
            fontSize: '0.8rem',
            marginTop: '0.5rem'
          }}>
            QRコードをスキャンしてアクセス
          </p>
        </div>
      )}
      
      <button
        onClick={startGame}
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
        ゲームスタート
      </button>
    </div>
  )

  const renderSelectionScreen = () => (
    <div style={{
      textAlign: 'center',
      backgroundColor: 'white',
      padding: '3rem',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      maxWidth: '600px',
      width: '100%'
    }}>
      <h2 style={{ 
        color: '#333', 
        marginBottom: '1rem',
        fontSize: '1.8rem'
      }}>
        カード選択 ({roundCount + 1}/5)
      </h2>
      <p style={{ 
        color: '#666', 
        marginBottom: '2rem',
        fontSize: '1rem'
      }}>
        下の2枚のカードから、より魅力的だと感じる方を選んでください
      </p>
      
      <div style={{
        display: 'flex',
        gap: '2rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {currentPair.map((card) => (
          <div
            key={card.no}
            onClick={() => selectCard(card)}
            style={{
              backgroundColor: '#f8f9fa',
              border: '2px solid #e9ecef',
              borderRadius: '15px',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '250px',
              textAlign: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
              e.currentTarget.style.borderColor = '#667eea'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.borderColor = '#e9ecef'
            }}
          >
            <h3 style={{
              color: '#333',
              fontSize: '1.4rem',
              marginBottom: '1rem',
              fontWeight: 'bold'
            }}>
              {card.title}
            </h3>
            <p style={{
              color: '#666',
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )

  const renderResultScreen = () => {
    const totalIntrinsic = selectedCards.reduce((sum, card) => sum + card.intrinsicPoint, 0)
    const totalExtrinsic = selectedCards.reduce((sum, card) => sum + card.extrinsicPoint, 0)
    
    return (
      <div style={{
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h2 style={{ 
          color: '#333', 
          marginBottom: '2rem',
          fontSize: '2rem'
        }}>
          結果
        </h2>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '15px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
              color: '#667eea',
              fontSize: '1.3rem',
              marginBottom: '0.5rem'
            }}>
              内発的動機ポイント
            </h3>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#333'
            }}>
              {totalIntrinsic}
            </div>
          </div>
          
          <div>
            <h3 style={{
              color: '#764ba2',
              fontSize: '1.3rem',
              marginBottom: '0.5rem'
            }}>
              外発的動機ポイント
            </h3>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#333'
            }}>
              {totalExtrinsic}
            </div>
          </div>
        </div>
        
        <p style={{
          color: '#666',
          marginBottom: '2rem',
          fontSize: '0.95rem',
          lineHeight: '1.5'
        }}>
          内発的動機が高い場合、あなたは自分自身の興味や満足感を重視します。<br />
          外発的動機が高い場合、あなたは外部からの評価や報酬を重視します。
        </p>
        
        <button
          onClick={resetGame}
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
          タイトルに戻る
        </button>
      </div>
    )
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case GameScreen.TITLE:
        return renderTitleScreen()
      case GameScreen.SELECTION:
        return renderSelectionScreen()
      case GameScreen.RESULT:
        return renderResultScreen()
      default:
        return renderTitleScreen()
    }
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
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'sans-serif'
      }}>
        {renderCurrentScreen()}
      </main>
    </>
  )
}