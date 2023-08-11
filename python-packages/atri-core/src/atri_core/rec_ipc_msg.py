import os
import sys
import platform
import socket


def rec_ipc_msg():
    system = platform.system()

    # Unix-based system (e.g., Linux, Mac)
    if system == 'Linux' or system == 'Darwin':
        server_address = os.environ["ATRI_IPC_PATH"]

        # Create a domain named socket
        server_socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)

        try:
            # Remove any existing socket file
            if os.path.exists(server_address):
                os.remove(server_address)

            # Bind the socket to the server address
            server_socket.bind(server_address)

            # Listen for incoming connections
            server_socket.listen(1)
            print('Domain named socket server started.')

            
            print('Waiting for a client connection...')
                # Accept a client connection
            client_socket, client_address = server_socket.accept()
            print('Client connected:', client_address)

            try:
                while True:
                        # Receive data from the client
                    data = client_socket.recv(2048)
                    if data:
                        print('Received message:', data.decode())
                    else:
                        print('Client disconnected:', client_address)
                        break

            finally:
                    client_socket.close()
                    

        except socket.error as e:
            print('Error:', e)
            sys.exit(1)

        finally:
            # Close the server socket
            server_socket.close()

    # Windows system
    elif system == 'Windows':
        import win32pipe, win32file, pywintypes
        pipe_name = os.environ["ATRI_IPC_PATH"]

        # Create a named pipe server
        pipe_handle = win32pipe.CreateNamedPipe(
            pipe_name,
            win32pipe.PIPE_ACCESS_DUPLEX,
            win32pipe.PIPE_TYPE_MESSAGE | win32pipe.PIPE_WAIT,
            1, 65536, 65536,
            0,
            None
        )

        try:
            # Connect to the client
            print('Waiting for a client connection...')
            win32pipe.ConnectNamedPipe(pipe_handle, None)
            print('Client connected.')

            while True:
                # Read data from the client
                data = win32file.ReadFile(pipe_handle, 4096)
                print(data)
                if data:
                    print('Received message:', data[1].decode())
                


        except pywintypes.error as e:
            print('Error:', e)
            sys.exit(1)
        
        finally:
          # Disconnect and close the pipe server
            win32pipe.DisconnectNamedPipe(pipe_handle)
            win32file.CloseHandle(pipe_handle)