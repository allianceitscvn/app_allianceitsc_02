import { useEffect, useState } from 'react';
import { Menu, X, Users } from 'lucide-react';
import { useNavigate, useParams, useLocation } from '@tanstack/react-router';
import { useAuthStore } from '../../stores/useAuthStore';
import { useChatStore } from '../../stores/useChatStore';
import { useDirectoryStore } from '../../stores/useDirectoryStore';
import { signalRService } from '../../lib/signalr/hub';
import { ConversationList } from './ConversationList';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { Composer } from './Composer';
import { EmptyState } from './EmptyState';
import { MembersPanel } from './MembersPanel';
import { TypingIndicator } from './TypingIndicator';
import { Button } from '@workspace/ui/components/Button';
import { cn } from '@workspace/ui/lib/utils';
import Toast from '../../lib/toast';

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams({ strict: false });
  
  const { currentUser } = useAuthStore();
  const {
    conversations,
    messagesByConv,
    selectedConvId,
    isLoading,
    isSending,
    messagePagination,
    isLoadingMoreMessages,
    typingUsersByConv,
    loadConversations,
    selectConversation,
    sendMessage,
    addReaction,
    ensureDMWith,
    loadMoreMessages,
    markAsRead,
    deleteConversation
  } = useChatStore();
  
  const { members, isLoading: membersLoading, loadMembers, subscribeToPresence } = useDirectoryStore();
  const { subscribeToMessages } = useChatStore();

  const [showMembers, setShowMembers] = useState(false);
  const [showConversations, setShowConversations] = useState(true);

  // Reconnect to SignalR on mount (handles page refresh)
  useEffect(() => {
    const initializeConnection = async () => {
      if (currentUser && !signalRService.isConnected()) {
        try {
          console.log('Reconnecting to SignalR after page refresh...');
          await signalRService.connect();
          console.log('SignalR reconnected successfully');
          
          // Resubscribe to presence and message events
          subscribeToPresence();
          subscribeToMessages();
        } catch (error) {
          console.error('Failed to reconnect to SignalR:', error);
          Toast.error('Failed to connect to chat server');
        }
      }
    };

    initializeConnection();
  }, [currentUser, subscribeToPresence, subscribeToMessages]);

  useEffect(() => {
    if (currentUser) {
      loadConversations(currentUser.id);
      loadMembers();
      
      // Subscribe to presence updates
      const unsubscribe = subscribeToPresence();
      return unsubscribe;
    }
  }, [currentUser, loadConversations, loadMembers, subscribeToPresence]);

  // Select conversation from URL params
  useEffect(() => {
    const conversationId = (params as any).conversationId;
    if (conversationId && conversationId !== selectedConvId && conversations.length > 0) {
      // Check if conversation exists
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        selectConversation(conversationId);
      }
    }
  }, [params, conversations, selectedConvId, selectConversation]);

  const selectedConversation = conversations.find(c => c.id === selectedConvId);
  const selectedMessages = selectedConvId ? messagesByConv[selectedConvId] || [] : [];
  
  // Get the other user for DM conversations
  const otherUserId = selectedConversation && !selectedConversation.isGroup
    ? selectedConversation.memberIds.find(id => id !== currentUser?.id)
    : undefined;
  const otherUser = otherUserId ? members.find(m => m.id === otherUserId) : undefined;

  const handleSendMessage = (text: string) => {
    if (currentUser) {
      sendMessage(text, currentUser.id);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (selectedConvId && currentUser) {
      addReaction(selectedConvId, messageId, emoji, currentUser.id);
    }
  };

  const handleComposerFocus = () => {
    if (selectedConvId) {
      markAsRead(selectedConvId);
    }
  };

  const handleStartChat = async (userId: string) => {
    if (currentUser && userId !== currentUser.id) {
      // Find the member to get their display name
      const member = members.find(m => m.id === userId);
      const displayName = member?.displayName;
      
      const conversationId = await ensureDMWith(userId, currentUser.id, displayName);
      
      // Navigate to the conversation URL
      if (conversationId) {
        navigate({ to: `/chat/${conversationId}` as any });
      }
      
      // Hide members panel and show chat panel
      setShowMembers(false);
      setShowConversations(false);
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setShowConversations(!showConversations);
            setShowMembers(false);
          }}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold">ChatApp</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setShowMembers(!showMembers);
            setShowConversations(false);
          }}
        >
          <Users className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left - Conversations */}
        <div
          className={cn(
            'w-full lg:w-80 xl:w-96 shrink-0 border-r bg-background',
            !showConversations && selectedConvId && 'hidden lg:block'
          )}
        >
          <ConversationList
            conversations={conversations}
            selectedConvId={selectedConvId}
            onSelectConversation={(id) => {
              navigate({ to: `/chat/${id}` as any });
              selectConversation(id);
              setShowConversations(false);
              setShowMembers(false);
            }}
            onDeleteConversation={async (id) => {
              await deleteConversation(id);
              if (selectedConvId === id) {
                navigate({ to: '/chat' as any });
              }
            }}
            currentUser={currentUser}
            isLoading={isLoading}
          />
        </div>

        {/* Center - Chat */}
        <div
          className={cn(
            'flex-1 flex flex-col min-w-0',
            showConversations && selectedConvId && 'hidden lg:flex',
            !selectedConvId && 'hidden lg:flex'
          )}
        >
          {selectedConvId && selectedConversation ? (
            <>
              <ChatHeader
                user={otherUser}
                title={selectedConversation.title}
                avatarUrl={selectedConversation.avatarUrl}
                onMembersClick={() => setShowMembers(!showMembers)}
              />
              <MessageList
                messages={selectedMessages}
                currentUserId={currentUser.id}
                users={members}
                conversationId={selectedConvId}
                onReaction={handleReaction}
                onLoadMore={() => loadMoreMessages(selectedConvId)}
                hasMore={messagePagination[selectedConvId]?.hasMore || false}
                isLoadingMore={isLoadingMoreMessages}
              />
              <TypingIndicator
                typingUsers={typingUsersByConv[selectedConvId] || []}
                currentUserId={currentUser.id}
              />
              <Composer 
                conversationId={selectedConvId}
                onSend={handleSendMessage} 
                isSending={isSending}
                onFocus={handleComposerFocus}
              />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
        <>
          {/* Backdrop overlay for mobile only */}
          {showMembers && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMembers(false)}
            />
          )}
          
          {/* Members Panel */}
          <div
            className={cn(
              'fixed right-0 top-0 bottom-0 w-80 bg-background z-50 shadow-2xl border-l',
              'lg:relative lg:shadow-none lg:w-80 xl:w-96 lg:z-0',
              'transition-transform duration-300 ease-in-out lg:transition-none',
              // On mobile: slide in/out based on showMembers
              // On large screens: always visible
              showMembers ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
            )}
          >
            {/* Close button for mobile only */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">All Members</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMembers(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <MembersPanel
              members={members}
              onStartChat={handleStartChat}
              isLoading={membersLoading}
            />
          </div>
        </>
      </div>
    </div>
  );
}
