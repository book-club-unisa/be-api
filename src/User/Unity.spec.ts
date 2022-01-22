import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookclub_membership } from "../Membership/Bookclub_membership";
import { PDL } from "../PDL/PDL";
import { ODL } from "../ODL/ODL";
import { Book } from "../Book/Book";
import { User } from "./User";
import { Bookclub } from "../Bookclub/Bookclub";
import { BookclubService } from "../Bookclub/bookclub.service";
import { Bookclub_user_invite } from "../Invite/Bookclub_user_invite";
import { ReadSession } from "../ReadSession/ReadSession";
import { MembershipService } from "../Membership/membership.service";
import { UserService } from "./user.service";
import { OdlService } from "../ODL/odl.service";
import { ReadSessionService } from "../ReadSession/ReadSession.service";
import { PdlService } from "../PDL/PDL.service";
import { InviteService } from '../Invite/invite.service';
import { BookService } from '../Book/book.service';
import {InvitoResponse} from '../Invite/InvitoResponse'
import { SHA256 } from 'sha2';

describe('USER', () => {
    let userService
    let bookclubService 
    let inviteService
    let membershipService
    let readSessionService
    let pdlService;
    let bookService;
    let odlService


    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'mysql',
                    host: 'localhost',
                    port: 3306,
                    username: 'root',
                    password: 'root',
                    database: 'books',
                    entities: [
                        Bookclub,
                        User,
                        Book,
                        Bookclub_user_invite,
                        Bookclub_membership,
                        ReadSession,
                        PDL,
                        ODL
                    ],
                    synchronize: false,
                }),
                TypeOrmModule.forFeature([Bookclub_user_invite]),
                TypeOrmModule.forFeature([Bookclub]),
                TypeOrmModule.forFeature([User]),
                TypeOrmModule.forFeature([Bookclub_membership]),
                TypeOrmModule.forFeature([ReadSession]),
                TypeOrmModule.forFeature([Book]),
                TypeOrmModule.forFeature([ODL]),
                TypeOrmModule.forFeature([PDL]),
            ],
            providers: [
                InviteService, UserService, BookclubService, MembershipService, OdlService, ReadSessionService, PdlService, BookService
            ],
        }).compile();
        userService = await module.get(UserService);
        bookclubService = await module.get(BookclubService);
        inviteService = await module.get(InviteService);
        membershipService = await module.get(MembershipService);
        readSessionService = await module.get(ReadSessionService);
        pdlService = await module.get(PdlService);
        bookService = await module.get(BookService);
        odlService = await module.get(OdlService);
    })


    /////////////USER
    it('CREATE USER ', async () => {
        const user: User = {
            email: 'giacomo@email.com',
            password: 'ciaociao',
            firstName: 'Franco',
            lastName: 'Carlo'
        }
        const result = await userService.createUser(user);
        const shaBuffer = SHA256(user.password);
        const newPass = shaBuffer.toString('base64');
        user.password = newPass
        expect(result).toEqual(user)
    })


    it('LOGIN', async () => {
        const user: User = {
            email: 'giacomo@email.com',
            password: 'ciaociao',
            firstName: 'Franco',
            lastName: 'Carlo'
        }
        const text = await userService.retrieveTokenByCredentials(user.email, user.password);
        expect(text).toBe('Z2lhY29tb0BlbWFpbC5jb21AQEBrekdoMG5QUndZYXNtV0JRc1lUZERHRnRTVnhMYi9lOG02QVd3aHpUTWVvPQ==')
    })

    it('GENERATE TOKEN', async () => {
        const email = 'giacomo@email.com';
        const password = 'ciaociao';
        const text = await userService.generateToken(email, password);
        expect(text).toBe('Z2lhY29tb0BlbWFpbC5jb21AQEBjaWFvY2lhbw==')
    })

    it('MAKE SAFER', async () => {
        const password = 'ciaociao';
        const text = await userService.makeSafe(password);
        expect(text).toBe('kzGh0nPRwYasmWBQsYTdDGFtSVxLb/e8m6AWwhzTMeo=')
    })


    it('SEARCH USER ', async () => {
        const email = 'giacomo@email.com';
        const password = 'kzGh0nPRwYasmWBQsYTdDGFtSVxLb/e8m6AWwhzTMeo='
        const result = await userService.findUser(email, password);
        const expectedResult = 'FOUND'
        expect(result).toBe(expectedResult)
    })

    it('SEARCH USER BY EMAIL ', async () => {
        const email = 'giacomo@email.com';
        const result = await userService.findUserByEmail(email);
        const expectedResult: User = {
            email: 'giacomo@email.com',
            firstName: 'Franco',
            lastName: 'Carlo',
            password: result.password
        }
        expect(result).toEqual(expectedResult)
    })

    it('DELETE USER ', async () => {
        const email = 'giacomo@email.com'
        const result = await userService.deleteUser(email);
        const expectedResult = {
            email: email,
            status: 'DELETED'
        }
        expect(result).toEqual(expectedResult)
    })


    /////////////BOOKS
    it('FIND BOOK BY TITLE ', async () => {
        const title = 'Sing Down the Moon'
        const result = await bookService.findBooksByTitle(title);
        const expected : Book[] = [];
        const expectedResult : Book = {
            isbn : '978-0-00-378067-3',
            title : 'SING DOWN THE MOON',
            author : 'Scott O\'Dell',
            pagesCount : 121,
            editor : 'Einaudi',
            description : 'The Spanish Slavers were an ever-present threat to the Navaho way of life. One lovely spring day, fourteen-year-old Bright Morning and her friend Running Bird took their sheep to pasture. The sky was clear blue against the red buttes of the Canyon de Schelly, and the fields and orchards of the Navahos promised a rich harvest. Bright Morning was happy as she gazed across the beautiful valley that was the home of her tribe. She tumed when Black Dog barked, and it was then that she saw the Spanish slavers riding straight toward her.',
            coverUrl : 'https://images.gr-assets.com/books/1410043213l/12725.jpg'
        }
        expected.push(expectedResult);
        expect(result).toEqual(expected)
    })

    it('FIND BOOK BY ISBN ', async () => {
        const isbn = '978-0-00-378067-3'
        const result = await bookService.findBookByIsbn(isbn);
        const expectedResult : Book = {
            isbn : isbn,
            title : 'Sing Down the Moon',
            author : 'Scott O\'Dell',
            pagesCount : 121,
            editor : 'Einaudi',
            description : 'The Spanish Slavers were an ever-present threat to the Navaho way of life. One lovely spring day, fourteen-year-old Bright Morning and her friend Running Bird took their sheep to pasture. The sky was clear blue against the red buttes of the Canyon de Schelly, and the fields and orchards of the Navahos promised a rich harvest. Bright Morning was happy as she gazed across the beautiful valley that was the home of her tribe. She tumed when Black Dog barked, and it was then that she saw the Spanish slavers riding straight toward her.',
            coverUrl : 'https://images.gr-assets.com/books/1410043213l/12725.jpg'
        }
        expect(result).toEqual(expectedResult)
    })

    /////////////INVITES    
    it('INVITE USER', async () => {
        const email = 'mariannavujko@alice.it';
        const id = 3;
        const result = await inviteService.inviteUser(email, id);
        const expectedResult: Bookclub_user_invite = {
            bookclub: id,
            user: email,
            State: 'PENDING',
            inviteId: 23
        };
        expect(result).toEqual(expectedResult)
    })

    it('DELETE INVITE', async () => {
        const email = 'marcopalmisciano@alice.it';
        const id = 2;
        const result = await inviteService.deleteInvite(email, id);
        const expectedResult = {
            "affected": 1,
            "raw": [],
        };
        expect(result).toEqual(expectedResult)
    })

    it('ACCEPT INVITE', async () => {
        const email = 'marcopalmisciano@alice.it';
        const id = 17;
        const result = await inviteService.acceptInvite(id,email);
        const expectedResult = {
            bookclub: 4,
            user: email,
            State: 'ACCEPTED',
            inviteId: id
        };
        expect(result).toEqual(expectedResult)
    })

    it('REFUSE INVITE', async () => {
        const email = 'alessiaamato@hotmail.it';
        const id = 18;
        const result = await inviteService.refuseInvite(id,email);
        const expectedResult = {
            bookclub: 4,
            user: email,
            State: 'REFUSED',
            inviteId: id
        };
        expect(result).toEqual(expectedResult)
    })

    it('SEE INVITES', async () => {
        const id = 5;
        const result = await inviteService.seeInvites(id);
        const expectedResult : InvitoResponse[] = [];
        expect(result).toEqual(expectedResult)
    })

    it('GET INVITES', async () => {
        const email = 'marcopalmisciano@alice.it';
        const result = await inviteService.getInvites(email);
        const expectedResult : InvitoResponse[] = [];
        const inv = {
            inviteId : 17,
            bookclub : 4,
            user : 'marcopalmisciano@alice.it',
            State : 'ACCEPTED'
        }
        const tmp  : InvitoResponse = {
            invitoUtente : inv,
            nomeBookclub : 'RossiBookclub',
            coverLibro : 'https://images.gr-assets.com/books/1348224589l/762763.jpg'
        }
        expectedResult.push(tmp);
    expect(result).toEqual(expectedResult)
    })

    /////////////MEMBERSHIP
    it('FIND MEMBER', async () => {
        const email = 'marcopalmisciano@alice.it';
        const id = 4;
        const result = await membershipService.findMember(id, email);
        const expectedResult = {
            bookclub: id,
            user: email,
            membershipId: 18,
            State: 'NOT COMPLETED',
            pageReached: 0
        }
        expect(result).toEqual(expectedResult)
    })

    it('ADD MEMBER', async () => {
        const email = 'marcopalmisciano@alice.it';
        const id = 1;
        const result = await membershipService.addMember(id, email);
        const expectedResult : Bookclub_membership = {
            bookclub: id,
            user: email,
            State: 'NOT COMPLETED',
            pageReached: 0,
            membershipId : 19
        }
        expect(result).toEqual(expectedResult)
    })

    /////////////READ SESSIONS
    it('GET PAGES', async () => {
        const id = 2;
        const result = await readSessionService.getPages(id);
        const expectedResult = 145
        expect(result).toBe(expectedResult)
    })

    it('GET ACTIVE SESSION', async () => {
        const user = 'alessiaamato@hotmail.it';
        const result = await readSessionService.getActiveSession(user);
        const expectedResult = 1
        expect(result).toBe(expectedResult)
    })

    /////////////PDL
    it('ADD PDL', async () => {
        const id = 1;
        const userEmail = 'antoniogiordano@hotmail.it';
        const newPDL = 700;
        const result : PDL= await pdlService.addPDL(newPDL,userEmail,id);
        let lastId = result.id;
        const session = result.session;
        const date = result.createDate;
        const expectedResult : PDL = {
            id : lastId,
            pages : 497,
            session : session,
            createDate : date
        }
        expect(result).toEqual(expectedResult)
    })

    it('GET PERCENTAGE', async () => {
        const id = 1;
        const userEmail = 'alessiaamato@hotmail.it';
        const result = await pdlService.getPercentage(userEmail,id);
        const bookclub : Bookclub = await bookclubService.findBookclub(id);
        const isbn = bookclub.book;
        const book : Book = await bookService.findBookByIsbn(isbn);
        const bookPages = book.pagesCount;
        const sessionId = await readSessionService.getActiveSession(userEmail);
        const pagesRead = await readSessionService.getPages(sessionId);
        const expectedResult = (pagesRead*100)/bookPages;
        expect(result).toEqual(expectedResult)
    })

    it('GET READSESSIONS', async () => {
        const userEmail = 'lucamorelli@libero.it';
        const result = await pdlService.getReadSessions(userEmail);
        const expectedResult : ReadSession[] = []; 
        const session : ReadSession = {
            book : '978-1-66941-569-5',
            user : userEmail,
            id : 2,
            State : 'ACTIVE'
        }

        expectedResult.push(session);
        expect(result).toEqual(expectedResult)
    })

    it('GET PDLS', async () => {
        const id = 1;
        const userEmail = 'alessiaamato@hotmail.it';
        const result : PDL [] = await pdlService.getPDLs(id, userEmail);
        const expectedResult : PDL[] = [];
        const date  = result[0].createDate;
        const PDL : PDL = {
            id : 1,
            session : id,
            pages : 100,
            createDate : date
        }
        expectedResult.push(PDL);
        expect(result).toEqual(expectedResult)
    })

    /////////////ODL
    it('CHECK STATUS', async () => {
        const bookclubId = 2;
        const result = await odlService.checkStatus(bookclubId);
        const expectedResult = 'CREATE';
        expect(result).toBe(expectedResult)
    })

    it('CERATE ODL', async () => {
        const bookclubId = 2;
        const milestone = 82;
        const result = await odlService.createODL(bookclubId, milestone);
        const expectedResult : ODL = {
            id : 5,
            bookclub : bookclubId,
            pages : milestone
        }
        expect(result).toEqual(expectedResult)
    })

    it('GET LAST ODL', async () => {
        const id = 2;
        const result = await odlService.getLastODL(id);
        const expectedResult : ODL = {
            id : 5,
            bookclub : id,
            pages : 82
        }
        expect(result).toEqual(expectedResult)
    })

    it('GET SECOND LAST ODL', async () => {
        const bookclubId = 2;
        const latestMilestone = 82;
        const result = await odlService.getSecondLastODL(bookclubId,latestMilestone);
        const expectedResult : ODL = {
            id : 2,
            bookclub : bookclubId,
            pages : 80
        }
        expect(result).toEqual(expectedResult)
    })

    it('UPDATE ODL', async () => {
        const bookclubId = 4;
        const milestone = 121;
        const result = await odlService.updateODL(bookclubId, milestone);
        const expectedResult : ODL = {
            id : 4,
            bookclub : bookclubId,
            pages : milestone
        }
        expect(result).toEqual(expectedResult)
    })

    it('CHECK ODL STATUS', async () => {
        const bookclubId = 2;
        const result = await odlService.checkODLStatus(bookclubId);
        const expectedResult : Bookclub_membership[] = [];
        const member : Bookclub_membership = {
            bookclub: bookclubId,
            user : 'lucamorelli@libero.it',
            membershipId : 2,
            State : 'NOT COMPLETED',
            pageReached : 145
        }

        const member2 : Bookclub_membership = {
            bookclub: bookclubId,
            user : 'giusepperagosta@libero.it',
            membershipId : 10,
            State : 'NOT COMPLETED',
            pageReached : 83
        }

        expectedResult.push(member);
        expectedResult.push(member2);
        expect(result).toEqual(expectedResult)
    })

    /////////////BOOKCLUB
    it('CREATE BOOKCLUB', async () => {
        const email = 'umbertoloria@gmail.com';
        const isbn = '978-1-287-67224-1';
        const name = 'PROVATESTING1'
        const result = await bookclubService.createBookclub(isbn, name, email);
        const expectedResult = {
            bookclubName: name,
            book: isbn,
            founder: email,
            id: 6
        }
        expect(result).toEqual(expectedResult)
    })

    it('VALIDATE FOUNDER', async () => {
        const email = 'umbertoloria@gmail.com';
        const id = 6;
        const result = await bookclubService.validateFounder(email,id);
        const expectedResult = 'FOUND';
        expect(result).toBe(expectedResult)
    })

    it('FIND BOOKCLUB', async () => {
        const id = 6
        const result = await bookclubService.findBookclub(id);
        const expectedResult = {
            bookclubName: 'PROVATESTING1',
            book: '978-1-287-67224-1',
            founder: 'umbertoloria@gmail.com',
            id: 6
        };
        expect(result).toEqual(expectedResult);
    })

    it('FIND BOOKCLUB ID', async () => {
        const email = 'umbertoloria@gmail.com';
        const name = 'PROVATESTING1';
        const result = await bookclubService.findBookclubId(name,email);
        const expectedResult = 6;
        expect(result).toBe(expectedResult)
    })

    
    it('DELETE BOOKCLUB', async () => {
        const id = 6;
        const result = await bookclubService.deleteBookclub(id);
        const expectedResult = 'BOOKCLUB DELETED';
        expect(result).toBe(expectedResult);
    })
})



