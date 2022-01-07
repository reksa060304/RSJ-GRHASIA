import { Component, OnInit } from '@angular/core';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { ChatService } from 'app/main/apps/chat/chat.service';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html'
})
export class ChatSidebarComponent implements OnInit {
  // Public
  public contacts;
  public chatUsers;
  public searchText;
  public chats;
  public selectedIndex = null;

  /**
   * Constructor
   *
   * @param {ChatService} _chatService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _chatService: ChatService, private _coreSidebarService: CoreSidebarService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open Chat
   *
   * @param id
   * @param newChat
   */
  openChat(id) {
    this._chatService.openChat(id);
  }

  /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name) {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Set Index
   *
   * @param index
   */
  setIndex(index: number) {
    this.selectedIndex = index;
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to contacts
    this._chatService.onContactsChange.subscribe(res => {
      this.contacts = res;
    });

    let skipFirst = 0;

    // Subscribe to chat users
    this._chatService.onChatUsersChange.subscribe(res => {
      this.chatUsers = res;

      // Skip setIndex first time when initialized
      if (skipFirst >= 1) {
        this.setIndex(this.chatUsers.length - 1);
      }
      skipFirst++;
    });

    // Subscribe to selected Chats
    this._chatService.onSelectedChatChange.subscribe(res => {
      this.chats = res;
    });
  }
}
