import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

interface FavoriteButtonProps {
  initialFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  initialFavorite = false,
  onToggle,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const toggleFavorite = () => {
    const newValue = !isFavorite;
    setIsFavorite(newValue);
    if (onToggle) {
      onToggle(newValue);
    }
  };

  return (
    <TouchableOpacity onPress={toggleFavorite} activeOpacity={0.7}>
      <Ionicons
        name={isFavorite ? 'bookmark' : 'bookmark-outline'}
        size={28}
        color={isFavorite ? Colors.favoriteActive : Colors.favoriteInactive}
      />
    </TouchableOpacity>
  );
};

export default FavoriteButton;
