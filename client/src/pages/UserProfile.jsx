import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { id: profileId } = useParams();
  return <div>{profileId}</div>;
};

export default UserProfile;
