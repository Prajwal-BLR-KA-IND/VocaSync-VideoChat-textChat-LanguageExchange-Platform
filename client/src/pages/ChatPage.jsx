import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuthUser } from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';

import { 
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
 } from "stream-chat-react"
import { axiosInstanace } from '../utils/axiosInstance';
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';
import ChatLoader from '../components/ChatLoader';
import CustomChannelHeader from '../components/CustomChannelHeader';
import CallButton from '../components/CallButton';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const {authUser} = useAuthUser();

  const {data:tokenData} = useQuery({
    queryKey: ["streamToken"],
    queryFn: async () => {
      const {data} = await axiosInstanace.get("/chat/token")
      return data;
    },
    enabled: !!authUser
  })

  useEffect(() => {
    const initChat = async() => {
      if(!tokenData?.token || !authUser ) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser({
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        }, tokenData.token)

        const channelId = [authUser._id, targetUserId].sort().join("-")

        const currentChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        })

        await currentChannel.watch();

        setChatClient(client);
        setChannel(currentChannel);

      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    initChat();
  }, [tokenData, authUser, targetUserId])

    const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="chat-wrapper">
      <Chat client={chatClient}>
        <Channel channel={channel} >
          <div className="chat-window">
            {/* <CallButton handleVideoCall={handleVideoCall} /> */}
            <Window>
              <CustomChannelHeader handleVideoCall={handleVideoCall}/>
              <MessageList/>
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
}

export default ChatPage