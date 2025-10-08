import Head from 'next/head'
import { useState, useCallback, useEffect } from 'react'
import { ArcanaCard, GameScreen, DiagnosisArchetype } from '../types/arcana'
import { arcanaCards } from '../data/arcanaCards'
import { diagnosisArchetypes } from '../data/diagnosisArchetypes'
import QRCode from 'qrcode'

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>(GameScreen.TITLE)
  const [usedCardIndices, setUsedCardIndices] = useState<Set<number>>(new Set())
  const [selectedCards, setSelectedCards] = useState<ArcanaCard[]>([])
  const [currentPair, setCurrentPair] = useState<ArcanaCard[]>([])
  const [roundCount, setRoundCount] = useState<number>(0)
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('')
  const [animatingCardNo, setAnimatingCardNo] = useState<number | null>(null)

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

  const getRandomUnusedCards = useCallback((count: number, currentUsedIndices?: Set<number>): ArcanaCard[] => {
    const usedIndices = currentUsedIndices || usedCardIndices
    const availableIndices = arcanaCards
      .map((_, index) => index)
      .filter(index => !usedIndices.has(index))
    
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
    // Start the animation
    setAnimatingCardNo(card.no)
    
    // Delay the game logic to allow animation to be visible
    setTimeout(() => {
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
      
      // Reset animation state
      setAnimatingCardNo(null)
      
      if (newRoundCount >= 5) {
        setCurrentScreen(GameScreen.RESULT)
      } else {
        const nextPair = getRandomUnusedCards(2, newUsedIndices)
        setCurrentPair(nextPair)
      }
    }, 600) // 600ms delay to allow animation to be seen
  }

  const resetGame = () => {
    setCurrentScreen(GameScreen.TITLE)
    setUsedCardIndices(new Set())
    setSelectedCards([])
    setCurrentPair([])
    setRoundCount(0)
  }

  const generateShareText = (diagnosis: DiagnosisArchetype, totalIntrinsic: number, totalExtrinsic: number, totalCollective: number, totalIndividual: number): string => {
    return `私のモチベーション診断結果✨

【${diagnosis.title}】
${diagnosis.axisCharacteristics}

内発的動機: ${totalIntrinsic}点
外発的動機: ${totalExtrinsic}点
集団的: ${totalCollective}点
個人的: ${totalIndividual}点

あなたもやってみませんか？
#MotivationArcana`
  }

  const shareToTwitter = (shareText: string) => {
    const appURL = 'https://tt-hasegawa.github.io/MotivationArcana/'
    const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appURL)}`
    
    if (typeof window !== 'undefined') {
      window.open(twitterURL, '_blank')
    }
  }

  const shareToLine = (shareText: string) => {
    const appURL = 'https://tt-hasegawa.github.io/MotivationArcana/'
    const lineURL = `https://line.me/R/msg/text/?${encodeURIComponent(shareText + '\n' + appURL)}`
    
    if (typeof window !== 'undefined') {
      window.open(lineURL, '_blank')
    }
  }

  const shareGeneral = (shareText: string) => {
    const appURL = 'https://tt-hasegawa.github.io/MotivationArcana/'
    
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'モチベーションアルカナ診断結果',
        text: shareText,
        url: appURL,
      }).catch(console.error)
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText + '\n' + appURL).then(() => {
        alert('診断結果をクリップボードにコピーしました！')
      }).catch(() => {
        alert('シェア機能がサポートされていません。')
      })
    }
  }

  const getDiagnosis = (intrinsic: number, extrinsic: number, collective: number, individual: number): DiagnosisArchetype => {
    // Determine motivation axis (内発 vs 外発 vs 中間)
    const motivationDiff = intrinsic - extrinsic
    let motivationAxis: 'intrinsic' | 'extrinsic' | 'middle'
    
    if (motivationDiff > 2) {
      motivationAxis = 'intrinsic'
    } else if (motivationDiff < -2) {
      motivationAxis = 'extrinsic'
    } else {
      motivationAxis = 'middle'
    }

    // Determine focus axis (個人 vs 集団 vs 中間)
    const focusDiff = individual - collective
    let focusAxis: 'individual' | 'collective' | 'middle'
    
    if (focusDiff > 2) {
      focusAxis = 'individual'
    } else if (focusDiff < -2) {
      focusAxis = 'collective'
    } else {
      focusAxis = 'middle'
    }

    // Map to archetype ID based on 3x3 grid
    const archetypeMap: { [key: string]: number } = {
      'extrinsic_individual': 1,   // 外発 × 個人
      'extrinsic_middle': 2,       // 外発 × 個人＝集団中間
      'extrinsic_collective': 3,   // 外発 × 集団
      'middle_individual': 4,      // 内発＝外発中間 × 個人
      'middle_middle': 5,          // 内発＝外発中間 × 個人＝集団中間
      'middle_collective': 6,      // 内発＝外発中間 × 集団
      'intrinsic_individual': 7,   // 内発 × 個人
      'intrinsic_middle': 8,       // 内発 × 個人＝集団中間
      'intrinsic_collective': 9    // 内発 × 集団
    }

    const key = `${motivationAxis}_${focusAxis}`
    const archetypeId = archetypeMap[key] || 5 // Default to balanced type
    
    return diagnosisArchetypes.find(archetype => archetype.id === archetypeId) || diagnosisArchetypes[4]
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
        fontSize: '2.5rem',
        fontFamily: 'Cinzel, serif',
        fontWeight: '600'
      }}>
        Motivation Arcana
      </h1>
      <p style={{ 
        color: '#666', 
        marginBottom: '2rem',
        fontSize: '1.1rem'
      }}>
        あなたの心の奥にある動機の源泉を発見しましょう
      </p>

      
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
      
      {qrCodeDataURL && (
        <div style={{ 
          marginTop: '2rem',
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
        {currentPair.map((card) => {
          const isAnimating = animatingCardNo === card.no
          return (
            <div
              key={card.no}
              onClick={() => selectCard(card)}
              style={{
                backgroundColor: '#f8f9fa',
                border: '2px solid #e9ecef',
                borderRadius: '15px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                width: '250px',
                textAlign: 'center',
                transform: isAnimating ? 'translateY(-20px) scale(1.05)' : 'translateY(0) scale(1)',
                boxShadow: isAnimating ? '0 15px 35px rgba(102, 126, 234, 0.3)' : 'none',
                borderColor: isAnimating ? '#667eea' : '#e9ecef',
                zIndex: isAnimating ? 10 : 1
              }}
              onMouseOver={(e) => {
                if (!isAnimating) {
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
                  e.currentTarget.style.borderColor = '#667eea'
                }
              }}
              onMouseOut={(e) => {
                if (!isAnimating) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = '#e9ecef'
                }
              }}
            >
            <h3 style={{
              color: '#333',
              fontSize: '1.4rem',
              marginBottom: '0.5rem',
              fontWeight: 'bold'
            }}>
              {card.title}
            </h3>
            <p style={{
              color: '#667eea',
              fontSize: '0.9rem',
              marginBottom: '1rem',
              fontStyle: 'italic',
              fontWeight: '500'
            }}>
              {card.englishSubtitle}
            </p>
            <p style={{
              color: '#666',
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>
              {card.description}
            </p>
          </div>
        )})}
      </div>
    </div>
  )

  const renderResultScreen = () => {
    const totalIntrinsic = selectedCards.reduce((sum, card) => sum + card.intrinsicPoint, 0)
    const totalExtrinsic = selectedCards.reduce((sum, card) => sum + card.extrinsicPoint, 0)
    const totalCollective = selectedCards.reduce((sum, card) => sum + card.collectivePoint, 0)
    const totalIndividual = selectedCards.reduce((sum, card) => sum + card.individualPoint, 0)
    
    const diagnosis = getDiagnosis(totalIntrinsic, totalExtrinsic, totalCollective, totalIndividual)
    
    return (
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
          marginBottom: '2rem',
          fontSize: '2rem'
        }}>
          診断結果
        </h2>
        
        {/* Diagnosis Section */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '15px',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <h3 style={{
            color: '#667eea',
            fontSize: '1.4rem',
            marginBottom: '1rem',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            あなたのモチベーション診断
          </h3>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '1.5rem',
            marginBottom: '1rem',
            border: '2px solid #667eea'
          }}>
            <h4 style={{
              color: '#333',
              fontSize: '1.2rem',
              marginBottom: '0.5rem',
              fontWeight: 'bold'
            }}>
              {diagnosis.title}
            </h4>
            <p style={{
              color: '#666',
              fontSize: '0.9rem',
              marginBottom: '0.5rem',
              fontStyle: 'italic'
            }}>
              軸の特徴: {diagnosis.axisCharacteristics}
            </p>
          </div>

          <div style={{
            marginBottom: '1rem'
          }}>
            <h5 style={{
              color: '#333',
              fontSize: '1rem',
              marginBottom: '0.5rem',
              fontWeight: 'bold'
            }}>
              状態の解説
            </h5>
            <p style={{
              color: '#666',
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }}>
              {diagnosis.explanation}
            </p>
          </div>

          <div>
            <h5 style={{
              color: '#333',
              fontSize: '1rem',
              marginBottom: '0.5rem',
              fontWeight: 'bold'
            }}>
              職場での典型例
            </h5>
            <p style={{
              color: '#666',
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }}>
              {diagnosis.typicalExamples}
            </p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '15px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <h3 style={{
                color: '#667eea',
                fontSize: '1.2rem',
                marginBottom: '0.5rem'
              }}>
                内発的動機ポイント
              </h3>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#333'
              }}>
                {totalIntrinsic}
              </div>
            </div>
            
            <div>
              <h3 style={{
                color: '#764ba2',
                fontSize: '1.2rem',
                marginBottom: '0.5rem'
              }}>
                外発的動機ポイント
              </h3>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#333'
              }}>
                {totalExtrinsic}
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem'
          }}>
            <div>
              <h3 style={{
                color: '#28a745',
                fontSize: '1.2rem',
                marginBottom: '0.5rem'
              }}>
                集団的ポイント
              </h3>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#333'
              }}>
                {totalCollective}
              </div>
            </div>
            
            <div>
              <h3 style={{
                color: '#dc3545',
                fontSize: '1.2rem',
                marginBottom: '0.5rem'
              }}>
                個人的ポイント
              </h3>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#333'
              }}>
                {totalIndividual}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Cards Section */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '15px',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <h3 style={{
            color: '#667eea',
            fontSize: '1.4rem',
            marginBottom: '1rem',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            選択したカード
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {selectedCards.map((card, index) => (
              <div key={card.no} style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '1rem',
                border: '1px solid #e9ecef'
              }}>
                <h4 style={{
                  color: '#333',
                  fontSize: '1.1rem',
                  marginBottom: '0.25rem',
                  fontWeight: 'bold'
                }}>
                  {card.title}
                </h4>
                <p style={{
                  color: '#667eea',
                  fontSize: '0.85rem',
                  marginBottom: '0.5rem',
                  fontStyle: 'italic',
                  fontWeight: '500'
                }}>
                  {card.englishSubtitle}
                </p>
                <p style={{
                  color: '#666',
                  fontSize: '0.8rem',
                  lineHeight: '1.4'
                }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Share Section */}
        <div style={{
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: '#333',
            fontSize: '1.2rem',
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>
            結果をシェアする
          </h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => shareToTwitter(generateShareText(diagnosis, totalIntrinsic, totalExtrinsic, totalCollective, totalIndividual))}
              style={{
                backgroundColor: '#1DA1F2',
                color: 'white',
                border: 'none',
                padding: '0.8rem 1.5rem',
                fontSize: '0.9rem',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(29, 161, 242, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(29, 161, 242, 0.4)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(29, 161, 242, 0.3)'
              }}
            >
              <span style={{ fontSize: '1.1em' }}>🐦</span>
              Twitter
            </button>

            <button
              onClick={() => shareToLine(generateShareText(diagnosis, totalIntrinsic, totalExtrinsic, totalCollective, totalIndividual))}
              style={{
                backgroundColor: '#00B900',
                color: 'white',
                border: 'none',
                padding: '0.8rem 1.5rem',
                fontSize: '0.9rem',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 185, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 185, 0, 0.4)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 185, 0, 0.3)'
              }}
            >
              <span style={{ fontSize: '1.1em' }}>💬</span>
              LINE
            </button>

            <button
              onClick={() => shareGeneral(generateShareText(diagnosis, totalIntrinsic, totalExtrinsic, totalCollective, totalIndividual))}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '0.8rem 1.5rem',
                fontSize: '0.9rem',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(108, 117, 125, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(108, 117, 125, 0.4)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(108, 117, 125, 0.3)'
              }}
            >
              <span style={{ fontSize: '1.1em' }}>📱</span>
              その他
            </button>
          </div>
        </div>
        
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