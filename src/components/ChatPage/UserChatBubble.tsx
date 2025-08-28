import './Chat.css'

export function UserChatBubble(props: { text: string }) {
  return (
    <view className="user-bubble">
      <text>{props.text}</text>
    </view>
  )
}