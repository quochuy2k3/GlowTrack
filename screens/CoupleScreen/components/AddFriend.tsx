import { useAuth } from '@/contexts/auth';
import { useServices } from '@/services';
import { CoupleResponse } from '@/services/couple/couple.service';
import { requestService } from '@/services/requests';
import { FriendRequest } from '@/services/requests/request.service';
import variables from '@/theme/commonColor';
import commonColor from '@/theme/commonColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Check, Navigation, Send, X } from '@tamagui/lucide-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { z } from 'zod';

// Email validation schema with Zod
const emailSchema = z.string().email({
  message: 'Please enter a valid email address',
});

interface AddFriendProps {
  setCouple: (couple: CoupleResponse) => void;
}

export const AddFriend = ({ setCouple }: AddFriendProps) => {
  const { t } = useTranslation();
  const services = useServices();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const {
    data: sentRequests,
    isLoading: isSentLoading,
    error: sentError,
    refetch: refetchSentRequests,
  } = useQuery<FriendRequest[]>('sentRequests', () => requestService.getSentRequests(), {
    refetchOnWindowFocus: true,
    onError: (error: any) => {
      console.error('Failed to fetch sent requests:', error);
    },
  });

  const {
    data: receivedRequests,
    isLoading: isReceivedLoading,
    error: receivedError,
    refetch: refetchReceivedRequests,
  } = useQuery<FriendRequest[]>('receivedRequests', () => requestService.getReceivedRequests(), {
    onError: (error: any) => {
      console.error('Failed to fetch received requests:', error);
    },
  });

  // Create friend request mutation
  const createRequestMutation = useMutation(
    (email: string) => requestService.createRequest(email),
    {
      onSuccess: () => {
        // Invalidate and refetch sent requests
        queryClient.invalidateQueries('sentRequests');
        setEmail('');
        setEmailError(null);

        fetchCouple();
      },
      onError: (error: any) => {
        if (error.response?.data?.detail) {
          setEmailError(error.response.data.detail);
        } else {
          setEmailError('Failed to send friend request');
        }
      },
    }
  );

  const fetchCouple = async () => {
    const response = await services.couple.getCouple();
    setCouple(response);
  };

  // Accept friend request mutation
  const acceptRequestMutation = useMutation(
    (requestId: string) => requestService.acceptRequest(requestId),
    {
      onSuccess: () => {
        // Invalidate and refetch both queries
        queryClient.invalidateQueries('receivedRequests');
        queryClient.invalidateQueries('sentRequests');

        // Notify parent component of success
        fetchCouple();
      },
      onError: (error: any) => {
        Alert.alert('Error', 'Failed to accept friend request');
        console.error('Failed to accept request:', error);
      },
    }
  );

  // Reject friend request mutation
  const rejectRequestMutation = useMutation(
    (requestId: string) => requestService.rejectRequest(requestId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('receivedRequests');
        fetchCouple();
      },
      onError: (error: any) => {
        Alert.alert('Error', 'Failed to reject friend request');
        console.error('Failed to reject request:', error);
      },
    }
  );

  // Delete sent friend request mutation
  const deleteSentRequestMutation = useMutation(
    (requestId: string) => requestService.deleteSentRequest(requestId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('sentRequests');
        fetchCouple();
      },
      onError: (error: any) => {
        Alert.alert('Error', 'Failed to delete friend request');
        console.error('Failed to delete request:', error);
      },
    }
  );

  const validateEmail = (email: string): boolean => {
    try {
      emailSchema.parse(email);
      setEmailError(null);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      } else {
        setEmailError('Invalid email');
      }
      return false;
    }
  };

  const handleSendRequest = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    // Use the mutation to create a friend request
    createRequestMutation.mutate(email);
  };

  const handleDeleteSentRequest = (requestId: string) => {
    deleteSentRequestMutation.mutate(requestId);
  };

  const handleAcceptRequest = (requestId: string) => {
    acceptRequestMutation.mutate(requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    rejectRequestMutation.mutate(requestId);
  };

  const handleRetry = () => {
    refetchSentRequests();
    refetchReceivedRequests();
  };

  // Loading state
  if (isSentLoading || isReceivedLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Error state
  if (sentError || receivedError) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error loading friend requests</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasSentRequest = sentRequests && sentRequests.length > 0;
  const sentRequest = hasSentRequest ? sentRequests[0] : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect with Partner</Text>

      {/* Input or Sent Request Card */}
      {hasSentRequest ? (
        <View style={styles.sentRequestCard}>
          <View style={styles.requestInfo}>
            <View style={styles.avatarContainer}>
              {sentRequest?.receiver_info?.avatar ? (
                <Image source={{ uri: sentRequest.receiver_info.avatar }} style={styles.avatar} />
              ) : (
                <Text style={styles.avatarText}>
                  {sentRequest?.receiver_info?.fullname?.[0]?.toUpperCase() ||
                    sentRequest?.partner_id?.[0]?.toUpperCase() ||
                    '?'}
                </Text>
              )}
            </View>
            <View style={styles.requestTextContainer}>
              <Text style={styles.requestName}>
                {sentRequest?.receiver_info?.fullname || 'Pending Connection'}
              </Text>
              <Text style={styles.requestEmail}>{sentRequest?.receiver_info?.email || ''}</Text>
              <Text style={styles.pendingText}>Invitation sent</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteSentRequest(sentRequest!.id)}
            disabled={deleteSentRequestMutation.isLoading}
          >
            {deleteSentRequestMutation.isLoading ? (
              <Text>...</Text>
            ) : (
              <X size={18} color="#DF3651" />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (emailError && text.trim()) {
                  validateEmail(text);
                }
              }}
              placeholder="Enter partner's email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#858585"
              editable={!createRequestMutation.isLoading}
            />
            <TouchableOpacity
              style={[styles.sendButton, createRequestMutation.isLoading && styles.disabledButton]}
              onPress={handleSendRequest}
              disabled={createRequestMutation.isLoading}
            >
              {createRequestMutation.isLoading ? (
                <Text style={styles.loadingText}>...</Text>
              ) : (
                <Send size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}
        </View>
      )}

      {/* Received Requests */}
      <View style={styles.requestsContainer}>
        <Text style={styles.sectionTitle}>Received Requests</Text>

        {!receivedRequests || receivedRequests.length === 0 ? (
          <Text style={styles.emptyText}>No invitations received</Text>
        ) : (
          receivedRequests.map(request => (
            <View key={request.id} style={styles.requestItem}>
              <View style={styles.requestInfo}>
                <View style={styles.avatarContainer}>
                  {request.sender_info?.avatar ? (
                    <Image source={{ uri: request.sender_info.avatar }} style={styles.avatar} />
                  ) : (
                    <Text style={styles.avatarText}>
                      {request.sender_info?.fullname?.[0]?.toUpperCase() ||
                        request.user_id?.[0]?.toUpperCase() ||
                        '?'}
                    </Text>
                  )}
                </View>
                <View style={styles.requestTextContainer}>
                  <Text style={styles.requestName}>
                    {request.sender_info?.fullname || 'Partner Request'}
                  </Text>
                  <Text style={styles.requestEmail}>
                    {request.sender_info?.email ||
                      `From user ID: ${request.user_id.substring(0, 8)}...`}
                  </Text>
                </View>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[
                    styles.acceptButton,
                    acceptRequestMutation.isLoading && styles.disabledButton,
                  ]}
                  onPress={() => handleAcceptRequest(request.id)}
                  disabled={acceptRequestMutation.isLoading || rejectRequestMutation.isLoading}
                >
                  <Check size={16} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.rejectButton,
                    rejectRequestMutation.isLoading && styles.disabledButton,
                  ]}
                  onPress={() => handleRejectRequest(request.id)}
                  disabled={acceptRequestMutation.isLoading || rejectRequestMutation.isLoading}
                >
                  <X size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#C8C8C8',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    color: '#1C1C1C',
  },
  inputError: {
    borderColor: '#DF3651',
    borderWidth: 1,
  },
  errorText: {
    color: '#DF3651',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1ECC78',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sentRequestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#C8C8C8',
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#F7F9FF',
  },
  pendingText: {
    fontSize: 12,
    color: '#1975FF',
    marginTop: 4,
  },
  requestsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 14,
    color: '#858585',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#C8C8C8',
    borderRadius: 12,
    marginBottom: 10,
  },
  requestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1975FF',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  requestTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  requestEmail: {
    fontSize: 14,
    color: '#858585',
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1ECC78',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rejectButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DF3651',
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#1975FF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
