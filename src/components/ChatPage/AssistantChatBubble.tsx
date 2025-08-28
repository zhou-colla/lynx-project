import './Chat.css'

export function AssistantChatBubble(props: { text: string }) {
  return (
    <view className="assistant-bubble">
      <text>{props.text}</text>
    </view>
  )
}