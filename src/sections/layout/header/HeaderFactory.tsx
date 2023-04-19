import { getCurrentAuthenticatedUser } from "js-dataverse/dist/users";
import { ReactElement } from "react";
import { Header } from "./Header";

export class HeaderFactory {
    static create(): ReactElement {
        return (
            <Header getCurrentAuthenticatedUser={getCurrentAuthenticatedUser} />
        )
    }
}
