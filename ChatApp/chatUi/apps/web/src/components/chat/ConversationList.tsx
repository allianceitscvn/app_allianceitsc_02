import { useState, useEffect } from 'react';
import { Conversation, User } from '../../types';
import { ConversationItem } from './ConversationItem';
import { Avatar, AvatarImage, AvatarFallback } from '@workspace/ui/components/Avatar';
import { Input } from '@workspace/ui/components/Textfield';
import { ScrollArea } from '@workspace/ui/components/ScrollArea';
import { Skeleton } from '@workspace/ui/components/Skeleton';
import { mockDirectoryService } from '../../lib/mock/directory';
import { confirm } from '@workspace/ui/components/ConfirmDialog';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConvId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => Promise<void>;
  currentUser: User;
  isLoading?: boolean;
}

export function ConversationList({
  conversations,
  selectedConvId,
  onSelectConversation,
  onDeleteConversation,
  currentUser,
  isLoading = false
}: ConversationListProps) {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load users for avatar/name display
    mockDirectoryService.listMembers().then(setUsers);
  }, []);

  const filteredConversations = conversations.filter(item => {
    if (!search) return true;
    
    const title = item.title?.toLowerCase() || '';
    const otherUserId = item.memberIds.find(id => id !== currentUser.id);
    const otherUser = users.find(u => u.id === otherUserId);
    const otherUserName = otherUser?.displayName?.toLowerCase() || '';
    
    return title.includes(search.toLowerCase()) || otherUserName.includes(search.toLowerCase());
  });

  const handleDeleteConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    const displayName = conversation?.title || 'cuộc trò chuyện này';

    confirm({
      title: 'Xoá cuộc trò chuyện',
      description: `Bạn có chắc chắn muốn xóa ${displayName}? Hành động này không thể hoàn tác.`,
      variant: 'destructive',
      cancel: { 
        label: 'Huỷ', 
        onClick: () => {} 
      },
      action: {
        label: 'Xoá',
        onClick: async () => {
          await onDeleteConversation(conversationId);
        },
      },
    });
  };

  return (
    <div className="flex flex-col h-full border-r bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.displayName} />
            <AvatarFallback>
              {currentUser.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">{currentUser.displayName}</h2>
          </div>
        </div>

        <Input
          placeholder="Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-3 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {search ? 'No conversations found' : 'No conversations yet'}
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((item) => {
              const otherUserId = item.memberIds.find(id => id !== currentUser.id);
              const otherUser = users.find(u => u.id === otherUserId);

              return (
                <ConversationItem
                  key={item.id}
                  conversation={item}
                  isSelected={selectedConvId === item.id}
                  onClick={() => onSelectConversation(item.id)}
                  onDelete={handleDeleteConversation}
                  otherUser={otherUser}
                />
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
