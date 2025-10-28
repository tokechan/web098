'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  registerServiceWorker, 
  requestNotificationPermission,
  subscribeToPush,
  sendTestNotification 
} from '@/lib/push'
import type { Message } from '@/lib/supabase'

export default function Home() {
  const [userId] = useState(() => `user_${Math.random().toString(36).slice(2, 11)}`)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [pushEnabled, setPushEnabled] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    // PWAモード（A2HS済み）かチェック
    const isPWA = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true
    setIsStandalone(isPWA)

    // 通知権限の状態を取得
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }

    // Service Worker 登録
    registerServiceWorker()

    // メッセージを取得
    loadMessages()

    // Realtime購読（リアルタイムUI更新）
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('[Realtime] Change received:', payload)
          loadMessages()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Load messages error:', error)
    } else {
      setMessages(data || [])
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const { error } = await supabase
      .from('messages')
      .insert({
        user_id: userId,
        content: newMessage,
      })

    if (error) {
      console.error('Send message error:', error)
      alert('メッセージ送信に失敗しました')
    } else {
      setNewMessage('')
    }
  }

  const handleEnablePush = async () => {
    const permission = await requestNotificationPermission()
    setNotificationPermission(permission)

    if (permission === 'granted') {
      const success = await subscribeToPush(userId)
      setPushEnabled(success)
      
      if (success) {
        alert('✅ Push通知が有効になりました！')
      } else {
        alert('❌ Push通知の有効化に失敗しました')
      }
    }
  }

  const handleTestNotification = async () => {
    const success = await sendTestNotification(userId)
    if (success) {
      alert('✅ テスト通知を送信しました！\n（アプリを閉じて確認してください）')
    } else {
      alert('❌ テスト通知の送信に失敗しました')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">PWA Push Demo</h1>
        <p className="text-sm text-gray-600 mb-6">User ID: {userId}</p>

        {/* PWA & Push 設定 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🔔 Push通知設定</h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">PWAモード（A2HS）:</span>
              <span className={`text-sm font-medium ${isStandalone ? 'text-green-600' : 'text-orange-600'}`}>
                {isStandalone ? '✅ 有効' : '⚠️ 無効'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">通知許可:</span>
              <span className={`text-sm font-medium ${
                notificationPermission === 'granted' ? 'text-green-600' : 
                notificationPermission === 'denied' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {notificationPermission === 'granted' ? '✅ 許可' : 
                 notificationPermission === 'denied' ? '❌ 拒否' : '⏳ 未設定'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Push購読:</span>
              <span className={`text-sm font-medium ${pushEnabled ? 'text-green-600' : 'text-gray-600'}`}>
                {pushEnabled ? '✅ 有効' : '⏳ 未設定'}
              </span>
            </div>
          </div>

          {!isStandalone && (
            <div className="bg-orange-50 border border-orange-200 rounded p-3 mb-4 text-sm">
              <p className="font-medium text-orange-800 mb-1">📱 iOSで通知を受け取るには</p>
              <ol className="list-decimal list-inside text-orange-700 space-y-1">
                <li>Safariの共有ボタンをタップ</li>
                <li>「ホーム画面に追加」を選択</li>
                <li>ホーム画面から起動</li>
              </ol>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleEnablePush}
              disabled={notificationPermission === 'granted'}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              {notificationPermission === 'granted' ? '通知許可済み' : 'Push通知を有効化'}
            </button>
            <button
              onClick={handleTestNotification}
              disabled={!pushEnabled}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700"
            >
              テスト通知
            </button>
          </div>
        </div>

        {/* メッセージ送信 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">💬 メッセージ送信</h2>
          <p className="text-sm text-gray-600 mb-3">
            メッセージを送信すると、Realtime経由で即座に画面が更新されます
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="メッセージを入力..."
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700"
            >
              送信
            </button>
          </div>
        </div>

        {/* メッセージ一覧 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📝 メッセージ一覧</h2>
          <div className="space-y-2">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-sm">まだメッセージがありません</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="border-b pb-2">
                  <p className="text-sm font-medium">{msg.content}</p>
                  <p className="text-xs text-gray-500">
                    {msg.user_id} · {new Date(msg.created_at).toLocaleString('ja-JP')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

