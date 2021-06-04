import { NOT_FOUND_PAGE_MESSAGES } from "../enums/404.enum";


export default function Navbar(props: any) {
    const handleOnClick = () => {
        console.log('404-action-clicked');
    }

    return (
      <div className="404">
          <h1 className="404-title">
              {NOT_FOUND_PAGE_MESSAGES.TITLE}
          </h1>
          <button
            onClick={() => handleOnClick}
            className="404-action">
              {NOT_FOUND_PAGE_MESSAGES.BODY}
          </button>
      </div>
    );
}
