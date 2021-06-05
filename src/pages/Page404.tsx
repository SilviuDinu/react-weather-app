import { NOT_FOUND_PAGE_MESSAGES } from '@enums/404.enum';
import Button from '@components/Button';
import { useHistory } from 'react-router-dom';

export default function Navbar(props: any) {
  const history = useHistory();

  const handleOnClick = () => {
    history.push('/');
  };

  return (
    <div className="404">
      <h1 className="404-title">
          {NOT_FOUND_PAGE_MESSAGES.TITLE}
      </h1>
      <div className="404-actions">
        <Button
            type="primary"
            text={NOT_FOUND_PAGE_MESSAGES.ACTION}
            onClick={handleOnClick}
        />
      </div>
    </div>
  );
}
